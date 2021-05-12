/* eslint-disable no-param-reassign */
import '../typedef.js';
import { validateCacheOptions, stringifySearchParams, getCache } from '../cache.js';

/**
 * Request interceptor to return relevant cached requests
 * @param {function(): string} getCacheIdentifier used to invalidate cache if identifier is changed
 * @param {CacheOptions} globalCacheOptions
 * @returns {RequestInterceptor}
 */
const createCacheRequestInterceptor = (getCacheIdentifier, globalCacheOptions) => {
  const validatedInitialCacheOptions = validateCacheOptions(globalCacheOptions);

  return /** @param {CacheRequest} cacheRequest */ async cacheRequest => {
    const cacheOptions = validateCacheOptions({
      ...validatedInitialCacheOptions,
      ...cacheRequest.cacheOptions,
    });

    cacheRequest.cacheOptions = cacheOptions;

    // don't use cache if 'useCache' === false
    if (!cacheOptions.useCache) {
      return cacheRequest;
    }

    const cacheId = cacheOptions.requestIdentificationFn(cacheRequest, stringifySearchParams);
    // cacheIdentifier is used to bind the cache to the current session
    const currentCache = getCache(getCacheIdentifier());
    const { method } = cacheRequest;

    // don't use cache if the request method is not part of the configs methods
    if (!cacheOptions.methods.includes(method.toLowerCase())) {
      // If it's NOT one of the config.methods, invalidate caches
      currentCache.delete(cacheId);
      // also invalidate caches matching to cacheOptions
      if (cacheOptions.invalidateUrls) {
        cacheOptions.invalidateUrls.forEach(
          /** @type {string} */ invalidateUrl => {
            currentCache.delete(invalidateUrl);
          },
        );
      }
      // also invalidate caches matching to invalidateUrlsRegex
      if (cacheOptions.invalidateUrlsRegex) {
        currentCache.deleteMatched(cacheOptions.invalidateUrlsRegex);
      }

      return cacheRequest;
    }

    const pendingRequest = currentCache.getPendingRequest(cacheId);
    if (pendingRequest) {
      // there is another concurrent request, wait for it to finish
      await pendingRequest;
    }

    const cacheResponse = currentCache.get(cacheId, cacheOptions.timeToLive);
    if (cacheResponse) {
      cacheRequest.cacheOptions = cacheRequest.cacheOptions ?? { useCache: false };
      const response = /** @type {CacheResponse} */ cacheResponse.clone();
      response.request = cacheRequest;
      response.fromCache = true;
      return response;
    }

    // we do want to use caching for this requesting, but it's not already cached
    // mark this as a pending request, so that concurrent requests can reuse it from the cache
    currentCache.setPendingRequest(cacheId);

    return cacheRequest;
  };
};

/**
 * Response interceptor to cache relevant requests
 * @param {function(): string} getCacheIdentifier used to invalidate cache if identifier is changed
 * @param {CacheOptions} globalCacheOptions
 * @returns {ResponseInterceptor}
 */
const createCacheResponseInterceptor = (getCacheIdentifier, globalCacheOptions) => {
  const validatedInitialCacheOptions = validateCacheOptions(globalCacheOptions);

  /**
   * Axios response https://github.com/axios/axios#response-schema
   */
  return /** @param {CacheResponse} cacheResponse */ async cacheResponse => {
    if (!getCacheIdentifier()) {
      throw new Error(`getCacheIdentifier returns falsy`);
    }

    if (!cacheResponse.request) {
      throw new Error('Missing request in response.');
    }

    const cacheOptions = validateCacheOptions({
      ...validatedInitialCacheOptions,
      ...cacheResponse.request?.cacheOptions,
    });

    // string that identifies cache entry
    const cacheId = cacheOptions.requestIdentificationFn(
      cacheResponse.request,
      stringifySearchParams,
    );
    const currentCache = getCache(getCacheIdentifier());
    const isAlreadyFromCache = !!cacheResponse.fromCache;
    // caching all responses with not default `timeToLive`
    const isCacheActive = cacheOptions.timeToLive > 0;
    const isMethodSupported = cacheOptions.methods.includes(
      cacheResponse.request.method.toLowerCase(),
    );
    // if the request is one of the options.methods; store response in cache
    if (!isAlreadyFromCache && isCacheActive && isMethodSupported) {
      // store the response data in the cache and mark request as resolved
      currentCache.set(cacheId, cacheResponse.clone());
    }

    currentCache.resolvePendingRequest(cacheId);
    return cacheResponse;
  };
};

/**
 * Response interceptor to cache relevant requests
 * @param {function(): string} getCacheIdentifier used to invalidate cache if identifier is changed
 * @param {CacheOptions} globalCacheOptions
 * @returns [{RequestInterceptor}, {ResponseInterceptor}]
 */
export const createCacheInterceptors = (getCacheIdentifier, globalCacheOptions) => {
  const requestInterceptor = createCacheRequestInterceptor(getCacheIdentifier, globalCacheOptions);
  const responseInterceptor = createCacheResponseInterceptor(
    getCacheIdentifier,
    globalCacheOptions,
  );
  return [requestInterceptor, responseInterceptor];
};
