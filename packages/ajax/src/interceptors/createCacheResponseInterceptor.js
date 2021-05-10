/* eslint-disable no-param-reassign */
import '../typedef.js';
import { validateCacheOptions, searchParamSerializer, getCache } from '../cache.js';
/**
 * Response interceptor to cache relevant requests
 * @param {function(): string} getCacheIdentifier used to invalidate cache if identifier is changed
 * @param {CacheOptions} globalCacheOptions
 * @returns {CachedResponseInterceptor}
 */
export const createCacheResponseInterceptor = (getCacheIdentifier, globalCacheOptions) => {
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
      searchParamSerializer,
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
