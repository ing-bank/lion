/* eslint-disable no-param-reassign */
import '../typedef.js';
import {
  ajaxCache,
  resetCacheSession,
  extendCacheOptions,
  validateCacheOptions,
  invalidateMatchingCache,
  pendingRequestStore,
  isCurrentSessionId,
} from '../cacheManager.js';

/**
 * Request interceptor to return relevant cached requests
 * @param {function(): string} getCacheId used to invalidate cache if identifier is changed
 * @param {CacheOptions} globalCacheOptions
 * @returns {RequestInterceptor}
 */
const createCacheRequestInterceptor =
  (getCacheId, globalCacheOptions) => /** @param {CacheRequest} request */ async request => {
    validateCacheOptions(request.cacheOptions);
    const cacheSessionId = getCacheId();
    resetCacheSession(cacheSessionId); // cacheSessionId is used to bind the cache to the current session

    const cacheOptions = extendCacheOptions({
      ...globalCacheOptions,
      ...request.cacheOptions,
    });

    // store cacheOptions and cacheSessionId in the request, to use it in the response interceptor.
    request.cacheOptions = cacheOptions;
    request.cacheSessionId = cacheSessionId;

    if (!cacheOptions.useCache) {
      return request;
    }

    const requestId = cacheOptions.requestIdFunction(request);
    const isMethodSupported = cacheOptions.methods.includes(request.method.toLowerCase());

    if (!isMethodSupported) {
      invalidateMatchingCache(requestId, cacheOptions);
      return request;
    }

    const pendingRequest = pendingRequestStore.get(requestId);
    if (pendingRequest) {
      // there is another concurrent request, wait for it to finish
      await pendingRequest;
    }

    const cachedResponse = ajaxCache.get(requestId, cacheOptions.maxAge);
    if (cachedResponse) {
      // Return the response from cache
      request.cacheOptions = request.cacheOptions ?? { useCache: false };
      /** @type {CacheResponse} */
      const response = cachedResponse.clone();
      response.request = request;
      response.fromCache = true;
      return response;
    }

    // Mark this as a pending request, so that concurrent requests can use the response from this request
    pendingRequestStore.set(requestId);
    return request;
  };

/**
 * Response interceptor to cache relevant requests
 * @param {CacheOptions} globalCacheOptions
 * @returns {ResponseInterceptor}
 */
const createCacheResponseInterceptor =
  globalCacheOptions => /** @param {CacheResponse} response */ async response => {
    if (!response.request) {
      throw new Error('Missing request in response');
    }

    const cacheOptions = extendCacheOptions({
      ...globalCacheOptions,
      ...response.request.cacheOptions,
    });

    const requestId = cacheOptions.requestIdFunction(response.request);
    const isAlreadyFromCache = !!response.fromCache;
    const isCacheActive = cacheOptions.useCache;
    const isMethodSupported = cacheOptions.methods.includes(response.request?.method.toLowerCase());

    if (!isAlreadyFromCache && isCacheActive && isMethodSupported) {
      if (isCurrentSessionId(response.request.cacheSessionId)) {
        // Cache the response
        ajaxCache.set(requestId, response.clone());
      }

      // Mark the pending request as resolved
      pendingRequestStore.resolve(requestId);
    }
    return response;
  };

/**
 * Response interceptor to cache relevant requests
 * @param {function(): string} getCacheId used to invalidate cache if identifier is changed
 * @param {CacheOptions} globalCacheOptions
 * @returns {{cacheRequestInterceptor: RequestInterceptor, cacheResponseInterceptor: ResponseInterceptor}}
 */
export const createCacheInterceptors = (getCacheId, globalCacheOptions) => {
  validateCacheOptions(globalCacheOptions);
  const cacheRequestInterceptor = createCacheRequestInterceptor(getCacheId, globalCacheOptions);
  const cacheResponseInterceptor = createCacheResponseInterceptor(globalCacheOptions);
  return { cacheRequestInterceptor, cacheResponseInterceptor };
};
