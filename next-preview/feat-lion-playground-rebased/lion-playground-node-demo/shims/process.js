/**
 * `process`, enough for a file-processing tool: argv, env, cwd, exit, stdio and a few timers.
 *
 * `exit()` does not end the page — it throws an `ExitError` that the runner catches, so a demo can
 * show the exit code like a terminal would instead of tearing down the runner.
 *
 * `platform`, `version` and `arch` are *reported*, not real: a tool that branches on them needs an
 * answer, and the filesystem it talks to is POSIX, so reporting a POSIX platform keeps path handling
 * and shell assumptions consistent.
 */
import { chdir, cwd } from './fs.js';

export class ExitError extends Error {
  /** @param {number} code */
  constructor(code) {
    super(`process.exit(${code})`);
    this.name = 'ExitError';
    this.code = code;
  }
}

/** @type {Map<string, {write: (chunk: string) => void}>} */
const streams = new Map();

/** @type {Set<string>} */
const listeners = new Set();

export const argv = ['node', 'demo.js'];
export const env = {};
export const version = 'v20.11.0';
export const versions = { node: '20.11.0', v8: '11.3', modules: '115' };
export const platform = 'linux';
export const arch = 'x64';
export const browser = true;
export const pid = 1;
export const ppid = 0;

/**
 * @param {string} name
 * @param {(chunk: string) => void} write
 * @returns {{write: (chunk: string) => void, end: () => void, on: () => any, once: () => any, removeListener: () => any}}
 */
export function __setStdio(name, write) {
  streams.set(name, { write });
  const stream = {
    write: (chunk) => {
      write(String(chunk));
      return true;
    },
    end: () => {},
    on: () => stream,
    once: () => stream,
    removeListener: () => stream,
    setEncoding: () => stream,
    isTTY: false,
  };
  return stream;
}

const noopStream = {
  write: () => true,
  end: () => {},
  on: (/** @type {string} */ _event, /** @type {Function} */ handler) => {
    void _event;
    void handler;
    return noopStream;
  },
  once: () => noopStream,
  removeListener: () => noopStream,
  setEncoding: () => noopStream,
  isTTY: false,
};

export const stdout = {
  ...noopStream,
  write: (chunk) => {
    streams.get('stdout')?.write(String(chunk));
    return true;
  },
};
export const stderr = {
  ...noopStream,
  write: (chunk) => {
    streams.get('stderr')?.write(String(chunk));
    return true;
  },
};
export const stdin = noopStream;

/** @param {number} [code] */
export function exit(code = 0) {
  throw new ExitError(code);
}

/** @param {string} [code] */
export function abort(code = 'SIGABRT') {
  throw new ExitError(code === 'SIGABRT' ? 134 : Number(code));
}

/** @param {() => void} callback */
export function nextTick(callback) {
  queueMicrotask(callback);
}

/** @returns {string} */
export { cwd };

/** @param {string} pathname */
export function chdirShim(pathname) {
  chdir(pathname);
}

/** @returns {{seconds: number, nanoseconds: number}} */
export function hrtime(previous) {
  const now = performance.now() * 1e6;
  if (!previous) return [Math.floor(now / 1e9), Math.round(now % 1e9)];
  const delta = now - (previous[0] * 1e9 + previous[1]);
  return [Math.floor(delta / 1e9), Math.round(delta % 1e9)];
}
hrtime.bigint = () => BigInt(Math.round(performance.now() * 1e6));

/** @returns {{rss: number, heapTotal: number, heapUsed: number, external: number, arrayBuffers: number}} */
export function memoryUsage() {
  const used = /** @type {any} */ (performance).memory?.usedJSHeapSize ?? 0;
  return { rss: used, heapTotal: used, heapUsed: used, external: 0, arrayBuffers: 0 };
}

/** @param {string} event @param {Function} handler */
export function on(event, handler) {
  listeners.add(handler);
  void event;
}
/** @param {string} event @param {Function} handler */
export function once(event, handler) {
  on(event, handler);
}
/** @param {string} event @param {Function} handler */
export function off(event, handler) {
  listeners.delete(handler);
  void event;
}
/** @param {string} event @param {...unknown} args */
export function emit(event, ...args) {
  for (const listener of [...listeners]) listener(...args);
  void event;
}

export const exitCode = 0;

export default {
  argv,
  env,
  version,
  versions,
  platform,
  arch,
  browser,
  pid,
  ppid,
  stdout,
  stderr,
  stdin,
  exit,
  abort,
  exitCode,
  nextTick,
  cwd,
  chdir: chdirShim,
  hrtime,
  memoryUsage,
  on,
  once,
  off,
  emit,
};
