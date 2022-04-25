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
 * Tests whether the request method is supported according to the `cacheOptions`
 * @param {ValidatedCacheOptions} cacheOptions
 * @param {string} method
 * @returns {boolean}
 */
const isMethodSupported = (cacheOptions, method) =>
  cacheOptions.methods.includes(method.toLowerCase());

/**
 * Tests whether the response content type is supported by the `contentTypes` whitelist
 * @param {Response} response
 * @param {CacheOptions} cacheOptions
 * @returns {boolean} `true` if the contentTypes property is not an array, or if the value of the Content-Type header is in the array
 */
const isResponseContentTypeSupported = (response, { contentTypes } = {}) => {
  if (!Array.isArray(contentTypes)) return true;

  return contentTypes.includes(String(response.headers.get('Content-Type')));
};

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

    if (!isMethodSupported(cacheOptions, request.method)) {
      invalidateMatchingCache(requestId, cacheOptions);
      return request;
    }

    const pendingRequest = pendingRequestStore.get(requestId);
    if (pendingRequest) {
      // there is another concurrent request, wait for it to finish
      await pendingRequest;
    }

    const cachedResponse = ajaxCache.get(requestId, cacheOptions.maxAge);
    if (cachedResponse && isResponseContentTypeSupported(cachedResponse, cacheOptions)) {
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

    if (!response.fromCache && isMethodSupported(cacheOptions, response.request.method)) {
      const requestId = cacheOptions.requestIdFunction(response.request);

      if (
        isCurrentSessionId(response.request.cacheSessionId) &&
        isResponseContentTypeSupported(response, cacheOptions)
      ) {
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
