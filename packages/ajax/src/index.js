import { Ajax } from './Ajax.js';

export { Ajax } from './Ajax.js';
export { AjaxFetchError } from './AjaxFetchError.js';
export {
  acceptLanguageRequestInterceptor,
  createXsrfRequestInterceptor,
  createCacheInterceptors,
} from './interceptors/index.js';

// globally available instance
export const ajax = new Ajax();

/**
 * @typedef {import('../types/types.js').LionRequestInit} LionRequestInit
 * @typedef {import('../types/types.js').AjaxConfig} AjaxConfig
 * @typedef {import('../types/types.js').RequestInterceptor} RequestInterceptor
 * @typedef {import('../types/types.js').ResponseInterceptor} ResponseInterceptor
 * @typedef {import('../types/types.js').CacheConfig} CacheConfig
 * @typedef {import('../types/types.js').RequestIdFunction} RequestIdFunction
 * @typedef {import('../types/types.js').CacheOptions} CacheOptions
 * @typedef {import('../types/types.js').CacheOptionsWithIdentifier} CacheOptionsWithIdentifier
 * @typedef {import('../types/types.js').ValidatedCacheOptions} ValidatedCacheOptions
 * @typedef {import('../types/types.js').CacheRequestExtension} CacheRequestExtension
 * @typedef {import('../types/types.js').CacheResponseRequest} CacheResponseRequest
 * @typedef {import('../types/types.js').CacheResponseExtension} CacheResponseExtension
 * @typedef {import('../types/types.js').CacheRequest} CacheRequest
 * @typedef {import('../types/types.js').CacheResponse} CacheResponse
 * @typedef {import('../types/types.js').CachedRequests} CachedRequests
 * @typedef {import('../types/types.js').CachedRequestInterceptor} CachedRequestInterceptor
 * @typedef {import('../types/types.js').CachedResponseInterceptor} CachedResponseInterceptor
 */
