/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */

import './typedef.js';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DEFAULT_TIME_TO_LIVE = HOUR;

class Cache {
  constructor() {
    this.expiration = new Date().getTime() + DEFAULT_TIME_TO_LIVE;
    /**
     * @type {{[url: string]: {expires: number, response: CacheResponse} }}
     * @private
     */
    this._cacheObject = {};
    /**
     * @type {{ [url: string]: { promise: Promise<void>, resolve: (v?: any) => void } }}
     * @private
     */
    this._pendingRequests = {};
  }

  /** @param {string} url  */
  setPendingRequest(url) {
    /** @type {(v: any) => void} */
    let resolve = () => {};
    const promise = new Promise(_resolve => {
      resolve = _resolve;
    });
    this._pendingRequests[url] = { promise, resolve };
  }

  /**
   * @param {string} url
   * @returns {Promise<void> | undefined}
   */
  getPendingRequest(url) {
    if (this._pendingRequests[url]) {
      return this._pendingRequests[url].promise;
    }
  }

  /** @param {string} url */
  resolvePendingRequest(url) {
    if (this._pendingRequests[url]) {
      this._pendingRequests[url].resolve();
      delete this._pendingRequests[url];
    }
  }

  /**
   * Store an item in the cache
   * @param {string} url key by which the cache is stored
   * @param {Response} response the cached response
   */
  set(url, response) {
    this._validateCache();
    this._cacheObject[url] = {
      expires: new Date().getTime(),
      response,
    };
  }

  /**
   * Retrieve an item from the cache
   * @param {string} url key by which the cache is stored
   * @param {number} timeToLive maximum time to allow cache to live
   * @returns {CacheResponse | false}
   */
  get(url, timeToLive) {
    this._validateCache();

    const cacheResult = this._cacheObject[url];
    if (!cacheResult) {
      return false;
    }
    const cacheAge = new Date().getTime() - cacheResult.expires;

    if (timeToLive !== null && cacheAge > timeToLive) {
      return false;
    }
    return cacheResult.response;
  }

  /**
   * Delete all items from the cache that contain the given url
   * @param {string} url key by which the cache is stored
   */
  delete(url) {
    this._validateCache();

    Object.keys(this._cacheObject).forEach(key => {
      if (key.includes(url)) {
        delete this._cacheObject[key];
        this.resolvePendingRequest(key);
      }
    });
  }

  /**
   * Delete all items from the cache that match given regex
   * @param {RegExp} regex an regular expression to match cache entries
   */
  deleteMatched(regex) {
    this._validateCache();

    Object.keys(this._cacheObject).forEach(key => {
      const notMatch = !new RegExp(regex).test(key);
      if (notMatch) return;
      delete this._cacheObject[key];
      this.resolvePendingRequest(key);
    });
  }

  /**
   * Validate cache on each call to the Cache
   * When the expiration date has passed, the _cacheObject will be replaced by an
   * empty object
   * @protected
   */
  _validateCache() {
    if (new Date().getTime() > this.expiration) {
      // @ts-ignore
      this._cacheObject = {};
      return false;
    }
    return true;
  }
}

let caches = {};

/**
 * Serialize search parameters into url query string parameters.
 * If params === null, returns ''
 * @param {Params} params query string parameters object
 * @returns {string} of querystring parameters WITHOUT `?` or empty string ''
 */
export const searchParamSerializer = (params = {}) =>
  // @ts-ignore
  typeof params === 'object' && params !== null ? new URLSearchParams(params).toString() : '';

/**
 * Returns the active cache instance for the current session
 * If 'cacheIdentifier' changes the cache is reset, we avoid situation of accessing old cache
 * and proactively clean it
 * @param {string} cacheIdentifier usually the refreshToken of the owner of the cache
 */
const getCache = cacheIdentifier => {
  if (caches[cacheIdentifier]?._validateCache()) {
    return caches[cacheIdentifier];
  }
  // invalidate old caches
  caches = {};
  // create new cache
  caches[cacheIdentifier] = new Cache();
  return caches[cacheIdentifier];
};

/**
 * @param {CacheOptions} options Options to match cache
 * @returns {ValidatedCacheOptions}
 */
export const validateOptions = ({
  useCache = false,
  methods = ['get'],
  timeToLive,
  invalidateUrls,
  invalidateUrlsRegex,
  requestIdentificationFn,
}) => {
  // validate 'cache'
  if (typeof useCache !== 'boolean') {
    throw new Error('Property `useCache` should be `true` or `false`');
  }

  if (methods[0] !== 'get' || methods.length !== 1) {
    throw new Error('Functionality to use cache on anything except "get" is not yet supported');
  }

  // validate 'timeToLive', default 1 hour
  if (timeToLive === undefined) {
    timeToLive = DEFAULT_TIME_TO_LIVE;
  }
  if (Number.isNaN(parseInt(String(timeToLive), 10))) {
    throw new Error('Property `timeToLive` must be of type `number`');
  }
  // validate 'invalidateUrls', must be an `Array` or `falsy`
  if (invalidateUrls) {
    if (!Array.isArray(invalidateUrls)) {
      throw new Error('Property `invalidateUrls` must be of type `Array` or `falsy`');
    }
  }
  // validate 'invalidateUrlsRegex', must be an regex expression or `falsy`
  if (invalidateUrlsRegex) {
    if (!(invalidateUrlsRegex instanceof RegExp)) {
      throw new Error('Property `invalidateUrlsRegex` must be of type `RegExp` or `falsy`');
    }
  }
  // validate 'requestIdentificationFn', default is url + searchParams
  if (requestIdentificationFn) {
    if (typeof requestIdentificationFn !== 'function') {
      throw new Error('Property `requestIdentificationFn` must be of type `function`');
    }
  } else {
    requestIdentificationFn = /** @param {any} data */ (
      { url, params },
      searchParamsSerializer,
    ) => {
      const serializedParams = searchParamsSerializer(params);
      return serializedParams ? `${url}?${serializedParams}` : url;
    };
  }

  return {
    useCache,
    methods,
    timeToLive,
    invalidateUrls,
    invalidateUrlsRegex,
    requestIdentificationFn,
  };
};

/**
 * Request interceptor to return relevant cached requests
 * @param {function(): string} getCacheIdentifier used to invalidate cache if identifier is changed
 * @param {CacheOptions} globalCacheOptions
 * @returns {CachedRequestInterceptor}
 */
export const cacheRequestInterceptorFactory = (getCacheIdentifier, globalCacheOptions) => {
  const validatedInitialCacheOptions = validateOptions(globalCacheOptions);

  return /** @param {CacheRequest} cacheRequest */ async cacheRequest => {
    const cacheOptions = validateOptions({
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

/**
 * Response interceptor to cache relevant requests
 * @param {function(): string} getCacheIdentifier used to invalidate cache if identifier is changed
 * @param {CacheOptions} globalCacheOptions
 * @returns {CachedResponseInterceptor}
 */
export const cacheResponseInterceptorFactory = (getCacheIdentifier, globalCacheOptions) => {
  const validatedInitialCacheOptions = validateOptions(globalCacheOptions);

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

    const cacheOptions = validateOptions({
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
