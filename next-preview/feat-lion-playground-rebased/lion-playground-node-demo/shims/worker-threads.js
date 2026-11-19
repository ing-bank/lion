/**
 * `worker_threads` — a real Web Worker behind the Node API.
 *
 * The underlying capability is not emulated: `new Worker()` here creates a genuine module worker, so the code in it
 * runs on another thread with its own realm, exactly as it would under Node. What differs is how a thread is
 * addressed and what can cross between threads:
 *
 *  - `workerData` is handed over in the worker's url hash rather than a constructor argument, because a browser
 *    worker has no other channel that is ready before its first line runs. The shim reads it back in the worker.
 *  - `parentPort` is `postMessage`/`onmessage` on the worker's own global, wrapped to look like a Node port.
 *  - `MessageChannel`, `MessagePort` and `BroadcastChannel` are the browser's own — they are the same API Node
 *    exposes, so they are re-exported rather than reimplemented.
 *  - The filesystem shim is per-realm. A worker gets *its own* in-memory filesystem, not the one the main thread
 *    wrote to; data crosses by message. That is a real difference from Node, where threads share a process.
 *  - `SharedArrayBuffer` between threads needs cross-origin isolation (COOP/COEP), which this deployment does not
 *    have, so shared memory is not available. `receiveMessageOnPort` needs a synchronous read of a port, which a
 *    browser cannot do, so it is absent rather than faked.
 */
import { EventEmitter } from './events.js';
import { SHIM_FILES } from './shim-files.js';

/** @type {boolean} */
const inWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;

/** @type {Map<string, unknown>} */
const environmentData = new Map();

export const isMainThread = !inWorker;
export const SHARE_ENV = Symbol.for('nodejs.worker_threads.SHARE_ENV');
export const threadId = inWorker ? readThreadId() : 0;

/**
 * The worker's own side of the channel: Node's `parentPort`, backed by the worker global's messaging.
 * @type {{postMessage: (value: unknown) => void, on: Function, once: Function, off: Function, start: () => void, ref: () => void, unref: () => void} | null}
 */
export const parentPort = inWorker ? createParentPort() : null;

/** @type {unknown} */
export const workerData = inWorker ? readWorkerData() : null;

/**
 * @returns {number}
 */
function readThreadId() {
  const match = /(?:^|[#&])threadId=(\d+)/.exec(self.location.hash);
  return match ? Number(match[1]) : 1;
}

/**
 * @returns {unknown}
 */
function readWorkerData() {
  const match = /(?:^|[#&])workerData=([^&]*)/.exec(self.location.hash);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

/**
 * @returns {any}
 */
function createParentPort() {
  const emitter = new EventEmitter();
  self.addEventListener('message', event => {
    emitter.emit('message', event.data);
  });
  return {
    postMessage: value => self.postMessage(value),
    on: (event, handler) => emitter.on(event, handler),
    once: (event, handler) => emitter.once(event, handler),
    off: (event, handler) => emitter.removeListener(event, handler),
    removeListener: (event, handler) => emitter.removeListener(event, handler),
    addListener: (event, handler) => emitter.on(event, handler),
    start: () => {},
    ref: () => {},
    unref: () => {},
  };
}

/** @type {Set<Worker>} */
const liveWorkers = new Set();

/**
 * Wait for every worker a demo started, the way a Node process stays alive for its threads.
 *
 * Measured need: without this a demo that spawns a worker reports `exitCode: 0` with the worker's message missing,
 * because the engine closes the report the moment the entry module finishes. Node does not: the process lives until
 * its threads are done.
 *
 * Node ends a thread when its event loop empties; a browser worker lives until it is closed, so waiting for it to
 * *finish* would always take the full timeout. This waits for quiet instead — no message for `quietMs` — with a hard
 * cap, because a playground must not hang on a worker that never talks. A worker cut off by the cap is reported.
 *
 * @param {{quietMs?: number, timeoutMs?: number}} [options]
 * @returns {Promise<{stillRunning: number, waitedMs: number, quiet: boolean}>} what the wait saw
 */
export async function __drainWorkers({ quietMs = 750, timeoutMs = 5000 } = {}) {
  if (liveWorkers.size === 0) return { stillRunning: 0, waitedMs: 0, quiet: true };
  const started = Date.now();
  const deadline = started + timeoutMs;
  let quietSince = started;
  const touch = () => {
    quietSince = Date.now();
  };
  for (const worker of liveWorkers) worker.on('message', touch);
  while (liveWorkers.size > 0 && Date.now() < deadline && Date.now() - quietSince < quietMs) {
    await new Promise(resolve => setTimeout(resolve, 25));
  }
  const stillRunning = liveWorkers.size;
  for (const worker of [...liveWorkers]) {
    worker.removeListener('message', touch);
    await worker.terminate();
  }
  liveWorkers.clear();
  return { stillRunning, waitedMs: Date.now() - started, quiet: Date.now() - quietSince >= quietMs };
}

let nextThreadId = 1;

/**
 * A worker thread. `new Worker(new URL('./worker.js', import.meta.url), { workerData })` is the form that works in
 * both worlds: Node accepts a URL, and so does this.
 *
 * The worker is started from a blob of the fetched source rather than from the url directly, because a module worker
 * created from a url does **not** inherit the document's import map — measured: the same demo ran under real Node
 * while the browser reported `worker failed` with the worker's `node:worker_threads` import unresolved. Fetching the
 * source lets the specifiers be resolved against this shim's own directory before the worker runs, and a blob is also
 * the form the sandboxed posture allows (`worker-src 'self' blob:` with an opaque origin has no usable `'self'`).
 */
export class Worker extends EventEmitter {
  /**
   * @param {string | URL} specifier
   * @param {{workerData?: unknown, name?: string, type?: 'module' | 'classic'}} [options]
   */
  constructor(specifier, options = {}) {
    super();
    const url = new URL(String(specifier), globalThis.location?.href ?? import.meta.url);
    this.threadId = ++nextThreadId;
    this._terminated = false;
    this._outbox = [];
    this._worker = null;
    liveWorkers.add(this);
    this._ready = this._start(url, options);
  }

  /**
   * Fetch the worker's source, resolve its imports, and start it from a blob.
   * @param {URL} url
   * @param {{workerData?: unknown, name?: string, type?: 'module' | 'classic'}} options
   */
  async _start(url, options) {
    let source;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      source = rewriteSpecifiers(await response.text(), url);
    } catch (error) {
      this._fail(new Error(`could not load worker ${url.href}: ${error.message}`));
      return;
    }
    if (options.workerData !== undefined) {
      const hash = `workerData=${encodeURIComponent(JSON.stringify(options.workerData))}&threadId=${this.threadId}`;
      const withHash = new URL(URL.createObjectURL(new Blob([source], { type: 'text/javascript' })));
      withHash.hash = hash;
      this._worker = new globalThis.Worker(withHash, { type: options.type ?? 'module', name: options.name });
    } else {
      const blobUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
      this._worker = new globalThis.Worker(blobUrl, { type: options.type ?? 'module', name: options.name });
    }
    this._worker.addEventListener('message', event => this.emit('message', event.data));
    this._worker.addEventListener('error', event => {
      const error = new Error(event.message || `worker ${url.pathname} failed to run`);
      if (event.filename) error.stack = `${error.message}\n    at ${event.filename}:${event.lineno}`;
      liveWorkers.delete(this);
      this.emit('error', error);
    });
    this._worker.addEventListener('messageerror', event => this.emit('messageerror', event.data));
    for (const value of this._outbox) this._worker.postMessage(value);
    this._outbox = [];
  }

  /** @param {Error} error */
  _fail(error) {
    liveWorkers.delete(this);
    this.emit('error', error);
  }

  /** @param {unknown} value */
  postMessage(value) {
    if (this._worker) this._worker.postMessage(value);
    else this._outbox.push(value);
  }

  /** @returns {Promise<number>} */
  async terminate() {
    if (this._terminated) return 0;
    this._terminated = true;
    liveWorkers.delete(this);
    await this._ready;
    this._worker?.terminate();
    this.emit('exit', 0);
    return 0;
  }

  ref() {}
  unref() {}
}

/**
 * Resolve the specifiers a worker module imports, the way the import map would for a document.
 *
 * A known builtin resolves to the sibling shim file; a relative specifier resolves against the worker's own url;
 * anything else is left alone, so an unresolvable import still fails loudly instead of silently pointing elsewhere.
 *
 * @param {string} source
 * @param {URL} workerUrl
 * @returns {string}
 */
function rewriteSpecifiers(source, workerUrl) {
  const shimBase = import.meta.url;
  return source.replace(
    /(\bfrom\s*|\bimport\s*\(\s*)(['"])([^'"]+)\2/g,
    (match, prefix, quote, specifier) => {
      const bare = specifier.replace(/^node:/, '');
      const file = SHIM_FILES[bare];
      if (file) return `${prefix}${quote}${new URL(`./${file}`, shimBase).href}${quote}`;
      if (specifier.startsWith('./') || specifier.startsWith('../')) {
        return `${prefix}${quote}${new URL(specifier, workerUrl).href}${quote}`;
      }
      return match;
    },
  );
}

/** @param {unknown} value */
export function markAsUntransferable(value) {
  void value;
}

/** @param {string} key @param {unknown} value */
export function setEnvironmentData(key, value) {
  environmentData.set(key, value);
}

/** @param {string} [key] */
export function getEnvironmentData(key) {
  return key === undefined ? Object.fromEntries(environmentData) : environmentData.get(key);
}

// The browser already has these, with the API Node exposes.
export const MessageChannel = globalThis.MessageChannel;
export const MessagePort = globalThis.MessagePort;
export const BroadcastChannel = globalThis.BroadcastChannel;

export default {
  isMainThread,
  parentPort,
  workerData,
  threadId,
  Worker,
  MessageChannel,
  MessagePort,
  BroadcastChannel,
  SHARE_ENV,
  markAsUntransferable,
  setEnvironmentData,
  getEnvironmentData,
};
