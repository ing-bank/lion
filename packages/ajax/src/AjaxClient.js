/* eslint-disable consistent-return */
import {
  cacheRequestInterceptorFactory,
  cacheResponseInterceptorFactory,
} from './interceptors-cache.js';
import { acceptLanguageRequestInterceptor, createXSRFRequestInterceptor } from './interceptors.js';
import { AjaxClientFetchError } from './AjaxClientFetchError.js';

import './typedef.js';

/**
 * HTTP Client which acts as a small wrapper around `fetch`. Allows registering hooks which
 * intercept request and responses, for example to add authorization headers or logging. A
 * request can also be prevented from reaching the network at all by returning the Response directly.
 */
export class AjaxClient {
  /**
   * @param {Partial<AjaxClientConfig>} config
   */
  constructor(config = {}) {
    /**
     * @type {Partial<AjaxClientConfig>}
     * @private
     */
    this.__config = {
      addAcceptLanguage: true,
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',
      jsonPrefix: '',
      cacheOptions: {
        getCacheIdentifier: () => '_default',
        ...config.cacheOptions,
      },
      ...config,
    };

    /** @type {Array.<RequestInterceptor|CachedRequestInterceptor>} */
    this._requestInterceptors = [];
    /** @type {Array.<ResponseInterceptor|CachedResponseInterceptor>} */
    this._responseInterceptors = [];

    if (this.__config.addAcceptLanguage) {
      this.addRequestInterceptor(acceptLanguageRequestInterceptor);
    }

    if (this.__config.xsrfCookieName && this.__config.xsrfHeaderName) {
      this.addRequestInterceptor(
        createXSRFRequestInterceptor(this.__config.xsrfCookieName, this.__config.xsrfHeaderName),
      );
    }

    if (this.__config.cacheOptions && this.__config.cacheOptions.useCache) {
      this.addRequestInterceptor(
        cacheRequestInterceptorFactory(
          this.__config.cacheOptions.getCacheIdentifier,
          this.__config.cacheOptions,
        ),
      );
      this.addResponseInterceptor(
        cacheResponseInterceptorFactory(
          this.__config.cacheOptions.getCacheIdentifier,
          this.__config.cacheOptions,
        ),
      );
    }
  }

  /**
   * Sets the config for the instance
   * @param {Partial<AjaxClientConfig>} config configuration for the AjaxClass instance
   */
  set options(config) {
    this.__config = config;
  }

  get options() {
    return this.__config;
  }

  /** @param {RequestInterceptor} requestInterceptor */
  addRequestInterceptor(requestInterceptor) {
    this._requestInterceptors.push(requestInterceptor);
  }

  /** @param {RequestInterceptor} requestInterceptor */
  removeRequestInterceptor(requestInterceptor) {
    const indexOf = this._requestInterceptors.indexOf(requestInterceptor);
    if (indexOf !== -1) {
      this._requestInterceptors.splice(indexOf);
    }
  }

  /** @param {ResponseInterceptor} responseInterceptor */
  addResponseInterceptor(responseInterceptor) {
    this._responseInterceptors.push(responseInterceptor);
  }

  /** @param {ResponseInterceptor} responseInterceptor */
  removeResponseInterceptor(responseInterceptor) {
    const indexOf = this._responseInterceptors.indexOf(responseInterceptor);
    if (indexOf !== -1) {
      this._responseInterceptors.splice(indexOf, 1);
    }
  }

  /**
   * Makes a fetch request, calling the registered fetch request and response
   * interceptors.
   *
   * @param {RequestInfo} info
   * @param {RequestInit & Partial<CacheRequestExtension>} [init]
   * @returns {Promise<Response>}
   */
  async request(info, init) {
    const request = /** @type {CacheRequest} */ (new Request(info, { ...init }));
    request.cacheOptions = init?.cacheOptions;
    request.params = init?.params;

    // run request interceptors, returning directly and skipping the network
    // if a interceptor returns a Response
    let interceptedRequest = request;
    for (const intercept of this._requestInterceptors) {
      // In this instance we actually do want to await for each sequence
      // eslint-disable-next-line no-await-in-loop
      const interceptedRequestOrResponse = await intercept(interceptedRequest);
      if (interceptedRequestOrResponse instanceof Request) {
        interceptedRequest = interceptedRequestOrResponse;
      } else {
        return interceptedRequestOrResponse;
      }
    }

    const response = /** @type {CacheResponse} */ (await fetch(interceptedRequest));
    response.request = interceptedRequest;

    let interceptedResponse = response;
    for (const intercept of this._responseInterceptors) {
      // In this instance we actually do want to await for each sequence
      // eslint-disable-next-line no-await-in-loop
      interceptedResponse = await intercept(interceptedResponse);
    }

    if (interceptedResponse.status >= 400 && interceptedResponse.status < 600) {
      throw new AjaxClientFetchError(request, interceptedResponse);
    }
    return interceptedResponse;
  }

  /**
   * Makes a fetch request, calling the registered fetch request and response
   * interceptors. Encodes/decodes the request and response body as JSON.
   *
   * @param {RequestInfo} info
   * @param {LionRequestInit} [init]
   * @template T
   * @returns {Promise<{ response: Response, body: T }>}
   */
  async requestJson(info, init) {
    const lionInit = {
      ...init,
      headers: {
        ...(init && init.headers),
        accept: 'application/json',
      },
    };

    if (lionInit && lionInit.body) {
      // eslint-disable-next-line no-param-reassign
      lionInit.headers['content-type'] = 'application/json';
      lionInit.body = JSON.stringify(lionInit.body);
    }

    // Now that we stringified lionInit.body, we can safely typecast LionRequestInit back to RequestInit
    const jsonInit = /** @type {RequestInit} */ (lionInit);
    const response = await this.request(info, jsonInit);
    let responseText = await response.text();

    if (typeof this.__config.jsonPrefix === 'string') {
      if (responseText.startsWith(this.__config.jsonPrefix)) {
        responseText = responseText.substring(this.__config.jsonPrefix.length);
      }
    }

    try {
      return {
        response,
        body: JSON.parse(responseText),
      };
    } catch (error) {
      throw new Error(`Failed to parse response from ${response.url} as JSON.`);
    }
  }
}
