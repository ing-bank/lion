/**
 * Which Node builtins the runner answers, and how faithfully.
 *
 * This registry is the honest boundary of "works for every package": the map below is what a package
 * may import, the coverage lists are what a package may rely on, and `getCompatibilityReport()` is
 * what the runner shows when a package asks for something that is not there — instead of failing
 * with a module-not-found somewhere deep in the bundle.
 *
 * Every entry is a *url*, because the browser resolves the package's own imports through an import
 * map: a shim is just another import-map target, so no bundler is involved and nothing is fetched
 * from outside the host.
 */
import * as events from './events.js';
import * as fs from './fs.js';
import * as fsPromises from './fs-promises.js';
import * as os from './os.js';
import * as path from './path.js';
import * as process from './process.js';
import * as url from './url.js';
import * as util from './util.js';
import * as workerThreads from './worker-threads.js';

/** @type {Record<string, string>} specifier -> shim module file */
import { SHIM_FILES } from './shim-files.js';

export { SHIM_FILES };

/** @type {Record<string, object>} shim name -> the module behind it, for direct use in a host page */
export const shimModules = { fs, fsPromises, path, process, os, util, events, url, workerThreads };

/**
 * Builtins that work. Pure computation or a browser API with the same shape.
 */
export const COVERED = [
  'assert',
  'buffer',
  'console',
  'events',
  'fs',
  'fs/promises',
  'os',
  'path',
  'perf_hooks',
  'process',
  'querystring',
  'string_decoder',
  'timers',
  'url',
  'util',
];

/**
 * Builtins that work with a documented limit.
 */
export const PARTIAL = {
  crypto: 'WebCrypto behind the common hashes and random; no X509, key formats or ciphers beyond AES-GCM',
  fs: 'an in-memory filesystem: no watchers, streams, file descriptors, permissions or symlinks',
  process: 'argv/env/cwd/exit/stdout/stderr; no signals, no IPC, no real memory numbers',
  stream: 'the browser has no streaming filesystem; a package that pipes files needs a real runtime',
  zlib: 'only if the package is bundlable with a browser zlib; not provided by this registry',
  worker_threads:
    'a real module Web Worker behind the API: another thread, another realm. workerData travels in the worker url hash, the filesystem shim is per-realm rather than shared, there is no SharedArrayBuffer (needs cross-origin isolation) and no receiveMessageOnPort (needs a synchronous port read)',
};

/**
 * Builtins that cannot work in a browser, and why. A package needing one of these needs a real Node
 * runtime (a wasm syscall layer or a server-side container), not a shim.
 *
 * `worker_threads` used to sit here. It does not belong: the browser has the capability — a worker is a worker —
 * and what was missing was the API over it, which the shim now provides. A Web Worker still cannot open a socket or
 * spawn a process, so the rest of this list stands.
 */
export const UNCOVERED = [
  'child_process',
  'cluster',
  'dgram',
  'http',
  'http2',
  'https',
  'inspector',
  'module',
  'net',
  'readline',
  'repl',
  'tls',
  'tty',
  'v8',
  'vm',
];

/**
 * Import-map entries for every builtin the runner answers, both the bare and the `node:` form.
 * @param {string} baseUrl url under which the shim files are served
 * @returns {Record<string, string>}
 */
export function getShimImportMapEntries(baseUrl) {
  const entries = {};
  for (const [specifier, file] of Object.entries(SHIM_FILES)) {
    const target = `${baseUrl.replace(/\/$/, '')}/${file}`;
    entries[specifier] = target;
    entries[`node:${specifier}`] = target;
  }
  return entries;
}

/**
 * @returns {{covered: string[], partial: string[], uncovered: string[], uncoveredReason: string}}
 */
export function getCompatibilityReport() {
  return {
    covered: [...COVERED, ...Object.keys(SHIM_FILES).filter(name => !COVERED.includes(name))],
    partial: Object.entries(PARTIAL).map(([name, limit]) => `${name}: ${limit}`),
    uncovered: [...UNCOVERED],
    uncoveredReason:
      'needs a real runtime (wasm syscall layer or a server-side container), not a shim',
  };
}

export default {
  shimModules,
  COVERED,
  PARTIAL,
  UNCOVERED,
  getShimImportMapEntries,
  getCompatibilityReport,
};
