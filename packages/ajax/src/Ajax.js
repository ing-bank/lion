/* eslint-disable consistent-return */
import {
  cacheRequestInterceptorFactory,
  cacheResponseInterceptorFactory,
} from './interceptors-cache.js';
import { acceptLanguageRequestInterceptor, createXSRFRequestInterceptor } from './interceptors.js';
import { AjaxFetchError } from './AjaxFetchError.js';

import './typedef.js';

/**
 * HTTP Client which acts as a small wrapper around `fetch`. Allows registering hooks which
 * intercept request and responses, for example to add authorization headers or logging. A
 * request can also be prevented from reaching the network at all by returning the Response directly.
 */
export class Ajax {
  /**
   * @param {Partial<AjaxConfig>} config
   */
  constructor(config = {}) {
    /**
     * @type {Partial<AjaxConfig>}
     * @private
     */
    this.__config = {
      addAcceptLanguage: true,
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',
      jsonPrefix: '',
      ...config,
      cacheOptions: {
        getCacheIdentifier: () => '_default',
        ...config.cacheOptions,
      },
    };

    /** @type {Array.<RequestInterceptor|CachedRequestInterceptor>} */
    this._requestInterceptors = [];
    /** @type {Array.<ResponseInterceptor|CachedResponseInterceptor>} */
    this._responseInterceptors = [];

    if (this.__config.addAcceptLanguage) {
      this.addRequestInterceptor(acceptLanguageRequestInterceptor);
    }

    const { xsrfCookieName, xsrfHeaderName } = this.__config;
    if (xsrfCookieName && xsrfHeaderName) {
      this.addRequestInterceptor(createXSRFRequestInterceptor(xsrfCookieName, xsrfHeaderName));
    }

    const { cacheOptions } = this.__config;
    if (cacheOptions?.useCache) {
      this.addRequestInterceptor(
        cacheRequestInterceptorFactory(cacheOptions.getCacheIdentifier, cacheOptions),
      );
      this.addResponseInterceptor(
        cacheResponseInterceptorFactory(cacheOptions.getCacheIdentifier, cacheOptions),
      );
    }
  }

  /**
   * Sets the config for the instance
   * @param {Partial<AjaxConfig>} config configuration for the AjaxClass instance
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
    this._requestInterceptors = this._requestInterceptors.filter(
      interceptor => interceptor !== requestInterceptor,
    );
  }

  /** @param {ResponseInterceptor} responseInterceptor */
  addResponseInterceptor(responseInterceptor) {
    this._responseInterceptors.push(responseInterceptor);
  }

  /** @param {ResponseInterceptor} responseInterceptor */
  removeResponseInterceptor(responseInterceptor) {
    this._responseInterceptors = this._responseInterceptors.filter(
      interceptor => interceptor !== responseInterceptor,
    );
  }

  /**
   * Makes a fetch request, calling the registered fetch request and response
   * interceptors.
   *
   * @param {RequestInfo} info
   * @param {RequestInit & Partial<CacheRequestExtension>} [init]
   * @returns {Promise<Response>}
   */
  async fetch(info, init) {
    const request = /** @type {CacheRequest} */ (new Request(info, { ...init }));
    request.cacheOptions = init?.cacheOptions;
    request.params = init?.params;

    // run request interceptors, returning directly and skipping the network
    const interceptedRequestOrResponse = await this.__interceptRequest(request);
    if (interceptedRequestOrResponse instanceof Response) {
      // prevent network request, return cached response
      return interceptedRequestOrResponse;
    }

    const response = /** @type {CacheResponse} */ (await fetch(interceptedRequestOrResponse));
    response.request = interceptedRequestOrResponse;

    const interceptedResponse = await this.__interceptResponse(response);

    if (interceptedResponse.status >= 400 && interceptedResponse.status < 600) {
      throw new AjaxFetchError(request, interceptedResponse);
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
  async fetchJson(info, init) {
    const lionInit = {
      ...init,
      headers: {
        ...init?.headers,
        accept: 'application/json',
      },
    };

    if (lionInit?.body) {
      // eslint-disable-next-line no-param-reassign
      lionInit.headers['content-type'] = 'application/json';
      lionInit.body = JSON.stringify(lionInit.body);
    }

    // Now that we stringified lionInit.body, we can safely typecast LionRequestInit back to RequestInit
    const jsonInit = /** @type {RequestInit} */ (lionInit);
    const response = await this.fetch(info, jsonInit);
    let responseText = await response.text();

    const { jsonPrefix } = this.__config;
    if (typeof jsonPrefix === 'string' && responseText.startsWith(jsonPrefix)) {
      responseText = responseText.substring(jsonPrefix.length);
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

  /**
   * @param {Request} request
   * @returns {Promise<Request | Response>}
   */
  async __interceptRequest(request) {
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
        return this.__interceptResponse(interceptedRequestOrResponse);
      }
    }
    return interceptedRequest;
  }

  /**
   * @param {Response} response
   * @returns {Promise<Response>}
   */
  async __interceptResponse(response) {
    let interceptedResponse = response;
    for (const intercept of this._responseInterceptors) {
      // In this instance we actually do want to await for each sequence
      // eslint-disable-next-line no-await-in-loop
      interceptedResponse = await intercept(interceptedResponse);
    }
    return interceptedResponse;
  }
}
