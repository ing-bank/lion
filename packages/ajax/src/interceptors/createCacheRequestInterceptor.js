/* eslint-disable no-param-reassign */
import '../typedef.js';
import { validateCacheOptions, searchParamSerializer, getCache } from '../cache.js';

/**
 * Request interceptor to return relevant cached requests
 * @param {function(): string} getCacheIdentifier used to invalidate cache if identifier is changed
 * @param {CacheOptions} globalCacheOptions
 * @returns {CachedRequestInterceptor}
 */
export const createCacheRequestInterceptor = (getCacheIdentifier, globalCacheOptions) => {
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

    const cacheId = cacheOptions.requestIdentificationFn(cacheRequest, searchParamSerializer);
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
