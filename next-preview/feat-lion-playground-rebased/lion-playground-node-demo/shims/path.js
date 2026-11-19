/**
 * POSIX `path`, the subset Node tools use. Not a port of node:path — a browser document has no
 * drive letters, and everything the runner runs sees a POSIX filesystem.
 */

/**
 * @param {string} pathname
 * @returns {string}
 */
export function normalize(pathname) {
  const isAbsolute = pathname.startsWith('/');
  const parts = [];
  for (const part of pathname.split('/')) {
    if (part === '' || part === '.') continue;
    if (part === '..') {
      if (parts.length) parts.pop();
      continue;
    }
    parts.push(part);
  }
  const joined = parts.join('/');
  return `${isAbsolute ? '/' : ''}${joined}` || (isAbsolute ? '/' : '.');
}

/**
 * @param {...string} segments
 * @returns {string}
 */
export function join(...segments) {
  return normalize(segments.filter(Boolean).join('/')) || '.';
}

/**
 * @param {...string} segments
 * @returns {string}
 */
export function resolve(...segments) {
  let resolved = '';
  for (let index = segments.length - 1; index >= 0; index -= 1) {
    const segment = segments[index];
    if (!segment) continue;
    resolved = `${segment}/${resolved}`;
    if (segment.startsWith('/')) break;
  }
  return resolved.startsWith('/') ? normalize(resolved) : normalize(`/${resolved}`).slice(1) || '.';
}

/**
 * @param {string} pathname
 * @returns {string}
 */
export function dirname(pathname) {
  const normalized = normalize(pathname);
  if (normalized === '/' || normalized === '.') return normalized === '.' ? '.' : '/';
  const cut = normalized.slice(0, normalized.lastIndexOf('/'));
  return cut || (normalized.startsWith('/') ? '/' : '.');
}

/**
 * @param {string} pathname
 * @param {string} [suffix]
 * @returns {string}
 */
export function basename(pathname, suffix) {
  const normalized = normalize(pathname);
  const base = normalized.slice(normalized.lastIndexOf('/') + 1) || normalized;
  return suffix && base.endsWith(suffix) ? base.slice(0, -suffix.length) : base;
}

/**
 * @param {string} pathname
 * @returns {string}
 */
export function extname(pathname) {
  const base = basename(pathname);
  const index = base.lastIndexOf('.');
  return index <= 0 ? '' : base.slice(index);
}

/**
 * @param {string} from
 * @param {string} to
 * @returns {string}
 */
export function relative(from, to) {
  const fromParts = normalize(from).split('/').filter(Boolean);
  const toParts = normalize(to).split('/').filter(Boolean);
  while (fromParts.length && toParts.length && fromParts[0] === toParts[0]) {
    fromParts.shift();
    toParts.shift();
  }
  return [...fromParts.map(() => '..'), ...toParts].join('/');
}

/**
 * @param {string} pathname
 * @returns {boolean}
 */
export function isAbsolute(pathname) {
  return pathname.startsWith('/');
}

/**
 * @param {string} pathname
 * @returns {{root: string, dir: string, base: string, ext: string, name: string}}
 */
export function parse(pathname) {
  const root = pathname.startsWith('/') ? '/' : '';
  const dir = root + dirname(pathname).replace(/^\//, '');
  const base = basename(pathname);
  const ext = extname(pathname);
  return { root, dir, base, ext, name: base.slice(0, base.length - ext.length) };
}

/**
 * @param {{dir?: string, root?: string, base?: string, name?: string, ext?: string}} parts
 * @returns {string}
 */
export function format(parts) {
  const base = parts.base || `${parts.name || ''}${parts.ext || ''}`;
  return join(parts.dir || parts.root || '', base);
}

export const sep = '/';
export const delimiter = ':';

export default {
  normalize,
  join,
  resolve,
  dirname,
  basename,
  extname,
  relative,
  isAbsolute,
  parse,
  format,
  sep,
  delimiter,
  posix: undefined,
};
