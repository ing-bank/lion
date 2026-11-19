/**
 * `url` — the browser already has `URL` and `URLSearchParams`, so this only adds what Node's module
 * has beyond those: conversions between file urls and paths, which tools use when they resolve
 * imports relative to themselves.
 */

export const URLShim = globalThis.URL;
export const URLSearchParamsShim = globalThis.URLSearchParams;

/**
 * @param {string | InstanceType<typeof globalThis.URL>} url
 * @returns {string}
 */
export function fileURLToPath(url) {
  const href = typeof url === 'string' ? url : url.href;
  const parsed = new URL(href);
  const decoded = decodeURIComponent(parsed.pathname);
  return decoded.length > 1 && decoded.endsWith('/') ? decoded.slice(0, -1) : decoded;
}

/**
 * @param {string} pathname
 * @returns {InstanceType<typeof globalThis.URL>}
 */
export function pathToFileURL(pathname) {
  const absolute = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return new URL(`file://${encodeURI(absolute).replace(/#/g, '%23').replace(/\?/g, '%3F')}`);
}

/**
 * @param {string | {protocol?: string, hostname?: string, pathname?: string, search?: string, hash?: string, auth?: string, slashes?: boolean}} input
 * @returns {string}
 */
export function format(input) {
  if (typeof input === 'string') return input;
  const protocol = input.protocol || '';
  const slashes = input.slashes || protocol.endsWith(':');
  const auth = input.auth ? `${input.auth}@` : '';
  const host = input.hostname || '';
  return `${protocol}${slashes ? '//' : ''}${auth}${host}${input.pathname || ''}${input.search || ''}${input.hash || ''}`;
}

/**
 * @param {string} href
 * @param {boolean} [parseQueryString]
 * @param {boolean} [slashesDenoteHost]
 * @returns {object}
 */
export function parse(href, parseQueryString) {
  const parsed = new URL(href, 'http://localhost');
  return {
    protocol: parsed.protocol,
    host: parsed.host,
    hostname: parsed.hostname,
    port: parsed.port,
    pathname: parsed.pathname,
    search: parsed.search,
    query: parseQueryString ? Object.fromEntries(parsed.searchParams) : parsed.search.slice(1),
    hash: parsed.hash,
    href: parsed.href,
  };
}

/** @param {string} from @param {boolean} [slashesDenoteHost] @returns {string} */
export function resolve(from, to) {
  return new URL(to, new URL(from, 'http://localhost')).href;
}

export default {
  URL: URLShim,
  URLSearchParams: URLSearchParamsShim,
  fileURLToPath,
  pathToFileURL,
  format,
  parse,
  resolve,
  Url: undefined,
};
