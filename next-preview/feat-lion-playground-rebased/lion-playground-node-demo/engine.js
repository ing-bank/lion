/**
 * The engine: runs a demo's entry module against the shim layer and reports what happened.
 *
 * It runs *inside* the fence, so the code it executes never holds the host origin's privileges. What
 * it needs comes from the fence document itself: the filesystem is the shims' in-memory one, and the
 * demo's imports are resolved by the import map in that document (the package's own modules from the
 * host's vendored mirror, the builtins from the shim urls).
 *
 * Input and output both go over `postMessage`: the host sets `window.__nodeDemoRunnerPayload` before
 * importing this module, and gets a report back with the output, the exit code and the resulting
 * file tree — so the host keeps the user interface and this keeps execution.
 */
import { __reset, __seed, __snapshot, readFileSync } from './shims/fs.js';
import * as nodeProcess from './shims/process.js';
import { ExitError, __setStdio } from './shims/process.js';

export const REPORT_SOURCE = 'lion-node-demo-runner';

/**
 * @typedef {{content: string} | string} DemoFile
 * @typedef {{entry: string, files: {[pathname: string]: DemoFile | {content: string}}}} DemoPayload
 * @typedef {{log: {stream: string, text: string}[], exitCode: number, files: {[pathname: string]: string}}} DemoReport
 */

/**
 * @param {DemoPayload} payload
 * @returns {{[pathname: string]: string}} files as the shim's seed expects them
 */
function toSeed(payload) {
  return Object.fromEntries(
    Object.entries(payload.files || {}).map(([pathname, file]) => [
      pathname,
      typeof file === 'string' ? file : file.content,
    ]),
  );
}

/**
 * What to import for the entry.
 *
 * A demo is a file we hand the runner, so the entry usually names a file in the virtual filesystem
 * rather than an installed package: `/demo.js`, `demo.js`. Such a file cannot be imported by name —
 * there is no specifier for it and the import map only covers vendored packages — so its content
 * becomes a blob url *in this document*, which is what makes the demo's own imports resolve through the
 * import map. Anything else is treated as a specifier, e.g. `@lion/nodejs-helpers`.
 *
 * N.B. relative imports between demo files do not work through this route: a blob module has no
 * siblings. A multi-file demo needs its specifiers rewritten to blob urls as well.
 * @param {DemoPayload} payload
 * @param {typeof globalThis} target
 * @returns {string}
 */
export function resolveEntry(payload, target) {
  const pathname = payload.entry.startsWith('/') ? payload.entry : `/${payload.entry}`;
  let content;
  try {
    content = readFileSync(pathname, 'utf8');
  } catch {
    return payload.entry; // not a file in the demo, so it is a specifier
  }
  return target.URL.createObjectURL(new target.Blob([content], { type: 'text/javascript' }));
}

/**
 * @param {{payload: DemoPayload, importEntry?: (specifier: string) => Promise<unknown>}} options
 * @returns {Promise<DemoReport>}
 */
export async function runDemo({
  payload,
  target = globalThis,
  importEntry = specifier => import(specifier),
}) {
  /** @type {{stream: string, text: string}[]} */
  const log = [];

  // Every run starts from a clean filesystem: a previous run's output must not be visible to this one.
  __reset();
  __seed(toSeed(payload));
  __setStdio('stdout', chunk => log.push({ stream: 'stdout', text: String(chunk) }));
  __setStdio('stderr', chunk => log.push({ stream: 'stderr', text: String(chunk) }));

  // Node exposes `process` as a global, and code relies on that without importing it (`process.env`,
  // `process.argv`, `process.exit`). The shim is a module, so it is installed as a global for the run —
  // only when the environment does not already have one, so this cannot shadow Node's own.
  if (!('process' in target)) {
    /** @type {any} */ (target).process = nodeProcess;
  }

  // In Node, `console` writes to stdout/stderr, so a demo's `console.log` belongs in the reported
  // output rather than in the frame's own console where nobody sees it. Installed for the same reason
  // as `process`: it is a global in Node, not an import.
  const write = stream => (...args) =>
    nodeProcess[stream].write(`${args.map(argument => String(argument)).join(' ')}\n`);
  /** @type {any} */ (target).console = {
    log: write('stdout'),
    info: write('stdout'),
    debug: write('stdout'),
    warn: write('stderr'),
    error: write('stderr'),
  };

  let exitCode = 0;
  try {
    await importEntry(resolveEntry(payload, target));
  } catch (error) {
    if (error instanceof ExitError) {
      exitCode = Number(error.code) || 0;
    } else {
      exitCode = 1;
      const message = error && error.message ? error.message : String(error);
      log.push({ stream: 'stderr', text: `${message}\n` });
    }
  }

  // A demo may have started a worker thread. Node keeps the process alive for it, so the report waits too. A worker
  // that only went quiet is normal in a browser (there is no event loop that empties), so that case says nothing; one
  // that had to be cut off by the cap is reported, with the real numbers rather than an invented duration.
  try {
    const workerThreads = await import('./shims/worker-threads.js');
    const drained = await workerThreads.__drainWorkers({ quietMs: 750, timeoutMs: 5000 });
    if (drained.stillRunning > 0 && !drained.quiet) {
      log.push({
        stream: 'stderr',
        text:
          `${drained.stillRunning} worker thread(s) still producing output after ${drained.waitedMs}ms; ` +
          'terminated to close the report\n',
      });
    }
  } catch {
    // No worker support in this host: nothing to wait for.
  }

  return { log, exitCode, files: __snapshot() };
}

/**
 * Fence-side wiring: run the payload the host left in the document, report it back, and allow a
 * re-run on request (a demo can be edited in the host's editor without reloading the fence).
 * @param {Window & {__nodeDemoRunnerPayload?: DemoPayload}} target
 * @returns {Promise<DemoReport | undefined>}
 */
export function startInFence(target) {
  const run = async () => {
    const payload = target.__nodeDemoRunnerPayload;
    if (!payload) return undefined;
    const report = await runDemo({ payload });
    /** @type {{parent: {postMessage: (message: unknown, targetOrigin: string) => void}}} */ (
      target
    ).parent.postMessage({ source: REPORT_SOURCE, ...report }, '*');
    return report;
  };

  target.addEventListener('message', event => {
    // @ts-expect-error - postMessage payloads are untyped by nature
    if (event.data && event.data.source === `${REPORT_SOURCE}-request`) run();
  });

  return run();
}

// Auto-start when loaded inside a fence document. The host has to set the payload global before
// importing this module; in any other context (a test, an import from node) nothing happens here.
if (
  typeof window !== 'undefined' &&
  window.parent !== window &&
  typeof /** @type {any} */ (window).__nodeDemoRunnerPayload !== 'undefined'
) {
  startInFence(/** @type {any} */ (window));
}

export default { runDemo, startInFence, resolveEntry, REPORT_SOURCE };
