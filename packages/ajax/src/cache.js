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
export const stringifySearchParams = (params = {}) =>
  typeof params === 'object' && params !== null ? new URLSearchParams(params).toString() : '';

/**
 * Returns the active cache instance for the current session
 * If 'cacheIdentifier' changes the cache is reset, we avoid situation of accessing old cache
 * and proactively clean it
 * @param {string} cacheIdentifier usually the refreshToken of the owner of the cache
 */
export const getCache = cacheIdentifier => {
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
export const validateCacheOptions = ({
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
    // eslint-disable-next-line no-shadow
    requestIdentificationFn = /** @param {any} data */ ({ url, params }, stringifySearchParams) => {
      const serializedParams = stringifySearchParams(params);
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
