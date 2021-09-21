import './typedef.js';
import Cache from './Cache.js';
import PendingRequestStore from './PendingRequestStore.js';

/**
 * The id for the cache session
 * @type {string | undefined}
 */
let cacheSessionId;

/**
 * The ajax cache
 * @type {Cache}
 */
export const ajaxCache = new Cache();

/**
 * The pending request store
 * @type {PendingRequestStore}
 */
export const pendingRequestStore = new PendingRequestStore();

/**
 * Checks whether the given cacheSessionId matches the currently active id.
 *
 * @param {string|undefined} cacheId The cache id to check
 */
export const isCurrentSessionId = cacheId => cacheId === cacheSessionId;

/**
 * Resets the cache session when the cacheId changes.
 *
 * There can be only 1 active session at all times.
 * @param {string} cacheId The cache id that is tied to the current session
 */
export const resetCacheSession = cacheId => {
  if (!cacheId) {
    throw new Error('Invalid cache identifier');
  }
  if (!isCurrentSessionId(cacheId)) {
    cacheSessionId = cacheId;
    ajaxCache.reset();
    pendingRequestStore.reset();
  }
};

/**
 * Stringify URL search params
 * @param {Params} params query string parameters object
 * @returns {string} of querystring parameters WITHOUT `?` or empty string ''
 */
const stringifySearchParams = (params = {}) =>
  typeof params === 'object' && params !== null ? new URLSearchParams(params).toString() : '';

/**
 * Returns request key string, which uniquely identifies a Request
 * @param {Partial<CacheRequest>} request Request object
 * @param {function} serializeSearchParams Function to serialize URL search params
 * @returns {string} requestId to uniquely identify a request
 */
const DEFAULT_GET_REQUEST_ID = (
  { url = '', params },
  serializeSearchParams = stringifySearchParams,
) => {
  const serializedParams = serializeSearchParams(params);
  return serializedParams ? `${url}?${serializedParams}` : url;
};

/**
 * Defaults to 1 hour
 */
const DEFAULT_MAX_AGE = 1000 * 60 * 60;

/**
 * @param {CacheOptions} options Cache options
 * @returns {ValidatedCacheOptions}
 */
export const extendCacheOptions = ({
  useCache = false,
  methods = ['get'],
  maxAge = DEFAULT_MAX_AGE,
  requestIdFunction = DEFAULT_GET_REQUEST_ID,
  invalidateUrls,
  invalidateUrlsRegex,
}) => ({
  useCache,
  methods,
  maxAge,
  requestIdFunction,
  invalidateUrls,
  invalidateUrlsRegex,
});

/**
 * @param {CacheOptions} options Cache options
 */
export const validateCacheOptions = ({
  useCache,
  methods,
  maxAge,
  requestIdFunction,
  invalidateUrls,
  invalidateUrlsRegex,
} = {}) => {
  if (useCache !== undefined && typeof useCache !== 'boolean') {
    throw new Error('Property `useCache` must be a `boolean`');
  }
  if (methods !== undefined && JSON.stringify(methods) !== JSON.stringify(['get'])) {
    throw new Error('Cache can only be utilized with `GET` method');
  }
  if (maxAge !== undefined && !Number.isFinite(maxAge)) {
    throw new Error('Property `maxAge` must be a finite `number`');
  }
  if (invalidateUrls !== undefined && !Array.isArray(invalidateUrls)) {
    throw new Error('Property `invalidateUrls` must be an `Array` or `falsy`');
  }
  if (invalidateUrlsRegex !== undefined && !(invalidateUrlsRegex instanceof RegExp)) {
    throw new Error('Property `invalidateUrlsRegex` must be a `RegExp` or `falsy`');
  }
  if (requestIdFunction !== undefined && typeof requestIdFunction !== 'function') {
    throw new Error('Property `requestIdFunction` must be a `function`');
  }
};

/**
 * Invalidates matching requestIds in the cache and pendingRequestStore
 *
 * There are two kinds of invalidate rules:
 * invalidateUrls (array of URL like strings)
 * invalidateUrlsRegex (RegExp)
 * If a non-GET method is fired, by default it only invalidates its own endpoint.
 * Invalidating /api/users cache by doing a PATCH, will not invalidate /api/accounts cache.
 * However, in the case of users and accounts, they may be very interconnected,
 * so perhaps you do want to invalidate /api/accounts when invalidating /api/users.
 * If it's NOT one of the config.methods, invalidate caches
 *
 * @param requestId { string }
 * @param cacheOptions { CacheOptions }
 */
export const invalidateMatchingCache = (requestId, { invalidateUrls, invalidateUrlsRegex }) => {
  // invalidate this request
  ajaxCache.delete(requestId);
  pendingRequestStore.resolve(requestId);

  // also invalidate caches matching to invalidateUrls
  if (Array.isArray(invalidateUrls)) {
    invalidateUrls.forEach(url => {
      ajaxCache.delete(url);
      pendingRequestStore.resolve(url);
    });
  }
  // also invalidate caches matching to invalidateUrlsRegex
  if (invalidateUrlsRegex) {
    ajaxCache.deleteMatching(invalidateUrlsRegex);
    pendingRequestStore.resolveMatching(invalidateUrlsRegex);
  }
};
