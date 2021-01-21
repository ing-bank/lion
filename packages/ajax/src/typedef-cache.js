/**
 * @typedef CacheConfig
 * @type {object}
 * @property {string} expires - timestamp when it expires
 */

/**
 * @typedef {Object} Params
 * @property {{[key:string]: string}=} _
 */

/**
 * @typedef {(request: CacheRequest, searchParamsSerializer: (params: Params) => string) => string} RequestIdentificationFn
 */

/**
 * @typedef {Object} CacheOptions
 * @property {'always' | 'never'} useCache
 * @property {string[]=} methods
 * @property {number=} timeToLive
 * @property {string[]=} invalidateUrls - only available per action (get, post etc)
 * @property {RegExp=} invalidateUrlsRegex - only available per action (get, post etc)
 * @property {RequestIdentificationFn=} requestIdentificationFn
 */

/**
 * @typedef {Object} ValidatedCacheOptions
 * @property {'always' | 'never'} useCache
 * @property {string[]} methods
 * @property {number} timeToLive
 * @property {string[]=} invalidateUrls - only available per action (get, post etc)
 * @property {RegExp=} invalidateUrlsRegex - only available per action (get, post etc)
 * @property {RequestIdentificationFn} requestIdentificationFn
 */

/**
 * @typedef {Object} GlobalCacheOptions
 * @property {'always' | 'never'} useCache
 * @property {string[]=} methods
 * @property {number=} timeToLive
 * @property {RequestIdentificationFn=} requestIdentificationFn
 */

/**
 * @typedef {Object} CacheRequestExtension
 * @property {CacheOptions=} lionCacheOptions
 * @property {number} status
 * @property {string} statusText
 * @property {any} adapter
 * @property {Params} params
 */

/**
 * @typedef {Object} CacheResponseConfig
 * @property {CacheOptions=} lionCacheOptions
 * @property {string} method
 */

/**
 * @typedef {Object} CacheResponseExtension
 * @property {CacheResponseConfig} config
 * @property {object} data
 */

/**
 * @typedef {Request & CacheRequestExtension} CacheRequest
 */

/**
 * @typedef {Response & CacheResponseExtension} CacheResponse
 */
