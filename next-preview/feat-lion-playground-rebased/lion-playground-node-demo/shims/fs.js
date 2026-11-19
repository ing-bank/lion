/**
 * An in-memory filesystem for the browser, covering the surface a Node tool actually touches.
 *
 * Node packages that process files mostly use a small slice of `fs`: read a file, write a file, list
 * a directory, check existence, maybe copy or rename. That slice is implementable over a `Map`, which
 * is what this is — no bundler, no wasm, no dependency.
 *
 * Deliberately not implemented (and reported as uncovered by the shim registry): file watching,
 * streams, file descriptors (`openSync`/`readSync`), permissions, symlinks, and anything that needs a
 * real device. A package that needs those needs a real runtime, and the runner should say so instead
 * of failing silently.
 *
 * Paths are POSIX: the browser has no drive letters, and the packages that branch on
 * `process.platform` behave consistently when it reports a POSIX platform.
 */

/** @type {Map<string, {content: Uint8Array, mode: number, mtimeMs: number}>} */
const files = new Map();
/** @type {Set<string>} */
const directories = new Set(['/']);

let currentDir = '/';

/**
 * @param {string} pathname
 * @returns {string}
 */
function normalize(pathname) {
  const parts = [];
  for (const part of pathname.split('/')) {
    if (part === '' || part === '.') continue;
    if (part === '..') {
      parts.pop();
      continue;
    }
    parts.push(part);
  }
  return `/${parts.join('/')}`;
}

/**
 * @param {string} pathname
 * @returns {string}
 */
function toAbsolute(pathname) {
  return normalize(pathname.startsWith('/') ? pathname : `${currentDir}/${pathname}`);
}

/**
 * @param {string} pathname
 */
function mkdirp(pathname) {
  const parts = normalize(pathname).split('/').filter(Boolean);
  let current = '';
  for (const part of parts) {
    current += `/${part}`;
    directories.add(current);
  }
}

/**
 * @param {string} pathname
 * @returns {boolean}
 */
function existsSync(pathname) {
  const absolute = toAbsolute(pathname);
  return files.has(absolute) || directories.has(absolute);
}

/**
 * @param {string} pathname
 * @param {{recursive?: boolean}} [options]
 */
function mkdirSync(pathname, options = {}) {
  const absolute = toAbsolute(pathname);
  if (options.recursive) {
    mkdirp(absolute);
    return;
  }
  const parent = absolute.slice(0, absolute.lastIndexOf('/')) || '/';
  if (!directories.has(parent)) {
    const error = new Error(`ENOENT: no such file or directory, mkdir '${pathname}'`);
    // @ts-expect-error - Node's error shape is what callers check
    error.code = 'ENOENT';
    throw error;
  }
  directories.add(absolute);
}

/**
 * @param {string} pathname
 * @param {string | Uint8Array | ArrayBuffer} data
 * @param {string} [encoding]
 */
function writeFileSync(pathname, data, encoding = 'utf8') {
  const absolute = toAbsolute(pathname);
  const parent = absolute.slice(0, absolute.lastIndexOf('/')) || '/';
  if (!directories.has(parent) && parent !== '/') mkdirp(parent);
  const content =
    typeof data === 'string'
      ? new TextEncoder().encode(data)
      : data instanceof Uint8Array
        ? data
        : new Uint8Array(data);
  files.set(absolute, { content, mode: 0o644, mtimeMs: Date.now() });
  void encoding;
}

/**
 * @param {string} pathname
 * @param {string} [encoding] pass null to get bytes, as in Node
 * @returns {string | Uint8Array}
 */
function readFileSync(pathname, encoding = 'utf8') {
  const absolute = toAbsolute(pathname);
  const entry = files.get(absolute);
  if (!entry) {
    const error = new Error(`ENOENT: no such file or directory, open '${pathname}'`);
    // @ts-expect-error - Node's error shape is what callers check
    error.code = 'ENOENT';
    throw error;
  }
  if (encoding === null || encoding === undefined) return entry.content;
  return new TextDecoder(encoding === 'buffer' ? 'utf-8' : encoding).decode(entry.content);
}

/**
 * @param {string} pathname
 * @param {{withFileTypes?: boolean}} [options]
 * @returns {string[] | {name: string, isDirectory(): boolean, isFile(): boolean}[]}
 */
function readdirSync(pathname, options = {}) {
  const absolute = toAbsolute(pathname);
  if (!directories.has(absolute) && !files.has(absolute)) {
    const error = new Error(`ENOENT: no such file or directory, scandir '${pathname}'`);
    // @ts-expect-error - Node's error shape is what callers check
    error.code = 'ENOENT';
    throw error;
  }
  const prefix = absolute === '/' ? '/' : `${absolute}/`;
  const names = new Set();
  for (const known of [...files.keys(), ...directories]) {
    if (!known.startsWith(prefix) || known === absolute) continue;
    const rest = known.slice(prefix.length);
    if (rest.includes('/')) {
      names.add(rest.slice(0, rest.indexOf('/')));
    } else if (rest) {
      names.add(rest);
    }
  }
  const sorted = [...names].sort();
  if (!options.withFileTypes) return sorted;
  return sorted.map(name => {
    const full = `${prefix}${name}`;
    const isDir = directories.has(full);
    return {
      name,
      isDirectory: () => isDir,
      isFile: () => !isDir,
      isSymbolicLink: () => false,
    };
  });
}

/**
 * @param {string} pathname
 * @returns {object}
 */
function statSync(pathname) {
  const absolute = toAbsolute(pathname);
  const entry = files.get(absolute);
  const isDir = directories.has(absolute);
  if (!entry && !isDir) {
    const error = new Error(`ENOENT: no such file or directory, stat '${pathname}'`);
    // @ts-expect-error - Node's error shape is what callers check
    error.code = 'ENOENT';
    throw error;
  }
  const size = entry ? entry.content.byteLength : 0;
  return {
    size,
    mode: entry ? entry.mode : 0o755,
    mtimeMs: entry ? entry.mtimeMs : Date.now(),
    birthtimeMs: entry ? entry.mtimeMs : Date.now(),
    isDirectory: () => isDir,
    isFile: () => !isDir,
    isSymbolicLink: () => false,
    isBlockDevice: () => false,
    isCharacterDevice: () => false,
    isFIFO: () => false,
    isSocket: () => false,
  };
}

/**
 * @param {string} pathname
 * @param {{recursive?: boolean, force?: boolean}} [options]
 */
function rmSync(pathname, options = {}) {
  const absolute = toAbsolute(pathname);
  if (!existsSync(absolute)) {
    if (options.force) return;
    const error = new Error(`ENOENT: no such file or directory, rm '${pathname}'`);
    // @ts-expect-error - Node's error shape is what callers check
    error.code = 'ENOENT';
    throw error;
  }
  files.delete(absolute);
  if (options.recursive) {
    const prefix = `${absolute}/`;
    for (const known of [...files.keys()]) if (known.startsWith(prefix)) files.delete(known);
    for (const known of [...directories]) if (known.startsWith(prefix)) directories.delete(known);
  }
  directories.delete(absolute);
}

/**
 * @param {string} from
 * @param {string} to
 */
function copyFileSync(from, to) {
  writeFileSync(to, readFileSync(from, null));
}

/**
 * @param {string} from
 * @param {string} to
 */
function renameSync(from, to) {
  const content = readFileSync(from, null);
  rmSync(from, { force: true });
  writeFileSync(to, content);
}

/**
 * @param {string} prefix
 * @returns {string}
 */
function mkdtempSync(prefix) {
  const dir = `${prefix}${Math.random().toString(36).slice(2, 10)}`;
  mkdirSync(dir, { recursive: true });
  return dir;
}

const syncApi = {
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  readdirSync,
  statSync,
  rmSync,
  copyFileSync,
  renameSync,
  mkdtempSync,
  realpathSync: (pathname) => toAbsolute(pathname),
  unlinkSync: (pathname) => rmSync(pathname, { force: true }),
  rmdirSync: (pathname) => rmSync(pathname, { recursive: true, force: true }),
  // The virtual filesystem is shared, so `chdir` is real; some tools rely on it.
  chdir: (pathname) => {
    currentDir = toAbsolute(pathname);
  },
  cwd: () => currentDir,
};

/**
 * Every sync function is also a named export, because the import map points a package's
 * `import { readFileSync } from 'fs'` straight at this module: the namespace has to carry them, not
 * only the default object.
 */
export {
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  readdirSync,
  statSync,
  rmSync,
  copyFileSync,
  renameSync,
  mkdtempSync,
};

/** Named exports for the functions other shims and callers import directly. */
export const chdir = syncApi.chdir;
export const cwd = syncApi.cwd;
export const realpathSync = syncApi.realpathSync;
export const unlinkSync = syncApi.unlinkSync;
export const rmdirSync = syncApi.rmdirSync;

const promisify =
  (fn) =>
  (...args) =>
    Promise.resolve().then(() => fn(...args));

export const promises = {
  readFile: promisify(readFileSync),
  writeFile: promisify(writeFileSync),
  mkdir: promisify(mkdirSync),
  readdir: promisify(readdirSync),
  stat: promisify(statSync),
  rm: promisify(rmSync),
  copyFile: promisify(copyFileSync),
  rename: promisify(renameSync),
  mkdtemp: promisify(mkdtempSync),
  realpath: promisify(syncApi.realpathSync),
  unlink: promisify(syncApi.unlinkSync),
  access: (pathname) =>
    existsSync(pathname)
      ? Promise.resolve()
      : Promise.reject(Object.assign(new Error(`ENOENT: ${pathname}`), { code: 'ENOENT' })),
};

export const constants = { F_OK: 0, R_OK: 4, W_OK: 2, X_OK: 1 };

/** Test and host seam: load a file tree into the filesystem. */
export function __seed(entries) {
  for (const [pathname, content] of Object.entries(entries)) writeFileSync(pathname, content);
}

/** Test and host seam: read the whole tree back out. */
export function __snapshot() {
  return Object.fromEntries(
    [...files.entries()].map(([pathname, entry]) => [
      pathname,
      new TextDecoder().decode(entry.content),
    ]),
  );
}

/**
 * Test and host seam: empty the filesystem and reset the working directory.
 *
 * The runner re-runs a demo on request, and without this the previous run's output files would still
 * be there — which would make a demo that asserts on its own output pass for the wrong reason.
 */
export function __reset() {
  files.clear();
  directories.clear();
  directories.add('/');
  currentDir = '/';
}

export default {
  ...syncApi,
  promises,
  constants,
  default: undefined,
};
