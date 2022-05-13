/* eslint-disable no-param-reassign */
import '../typedef.js';
import {
  ajaxCache,
  extendCacheOptions,
  invalidateMatchingCache,
  isCurrentSessionId,
  pendingRequestStore,
  resetCacheSession,
  validateCacheOptions,
} from '../cacheManager.js';

/**
 * Tests whether the request method is supported according to the `cacheOptions`
 * @param {string[]} methods
 * @param {string} method
 * @returns {boolean}
 */
const isMethodSupported = (methods, method) => methods.includes(method.toLowerCase());

/**
 * Tests whether the response content type is supported by the `contentTypes` whitelist
 * @param {Response} response
 * @param {string[]|undefined} contentTypes
 * @returns {boolean} `true` if the contentTypes property is not an array, or if the value of the Content-Type header is in the array
 */
const isResponseContentTypeSupported = (response, contentTypes) => {
  if (!Array.isArray(contentTypes)) return true;

  return contentTypes.includes(String(response.headers.get('Content-Type')));
};

/**
 * @param {Response} response
 * @returns {Promise<number>}
 */
const getResponseSize = async response =>
  Number(response.headers.get('Content-Length')) || (await response.clone().blob()).size || 0;

/**
 * Tests whether the response size is not too large to be cached according to the `maxResponseSize` property
 * @param {number|undefined} responseSize
 * @param {number|undefined} maxResponseSize
 * @returns {boolean} `true` if the `maxResponseSize` property is not larger than zero, or if the response size is not known, or if the value of the header is not larger than the `maxResponseSize` property
 */
const isResponseSizeSupported = (responseSize, maxResponseSize) => {
  if (!maxResponseSize) return true;
  if (!responseSize) return true;

  return responseSize <= maxResponseSize;
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

    const { useCache, requestIdFunction, methods, contentTypes, maxAge, maxResponseSize } =
      cacheOptions;

    // store cacheOptions and cacheSessionId in the request, to use it in the response interceptor.
    request.cacheOptions = cacheOptions;
    request.cacheSessionId = cacheSessionId;

    if (!useCache) {
      return request;
    }

    const requestId = requestIdFunction(request);

    if (!isMethodSupported(methods, request.method)) {
      invalidateMatchingCache(requestId, cacheOptions);
      return request;
    }

    const pendingRequest = pendingRequestStore.get(requestId);
    if (pendingRequest) {
      // there is another concurrent request, wait for it to finish
      await pendingRequest;
    }

    const cachedResponse = ajaxCache.get(requestId, { maxAge, maxResponseSize });
    if (cachedResponse && isResponseContentTypeSupported(cachedResponse, contentTypes)) {
      // Return the response from cache
      request.cacheOptions = request.cacheOptions ?? { useCache: false };

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
const createCacheResponseInterceptor = globalCacheOptions => async responseParam => {
  const response = /** @type {CacheResponse} */ (responseParam);

  if (!response.request) {
    throw new Error('Missing request in response');
  }

  const {
    requestIdFunction,
    methods,
    contentTypes,
    maxResponseSize,
    maxCacheSize,
    replacementPolicy,
  } = extendCacheOptions({
    ...globalCacheOptions,
    ...response.request.cacheOptions,
  });

  if (!response.fromCache && isMethodSupported(methods, response.request.method)) {
    const requestId = requestIdFunction(response.request);
    const responseSize = maxCacheSize || maxResponseSize ? await getResponseSize(response) : 0;

    if (
      isCurrentSessionId(response.request.cacheSessionId) &&
      isResponseContentTypeSupported(response, contentTypes) &&
      isResponseSizeSupported(responseSize, maxResponseSize)
    ) {
      // Cache the response
      ajaxCache.set(requestId, response.clone(), responseSize);

      // Truncate the cache if needed
      if (maxCacheSize) {
        replacementPolicy.call(ajaxCache, maxCacheSize);
      }
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
