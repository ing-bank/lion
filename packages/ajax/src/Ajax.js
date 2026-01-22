/* eslint-disable consistent-return */
import {
  acceptLanguageRequestInterceptor,
  createXsrfRequestInterceptor,
  createCacheInterceptors,
} from './interceptors/index.js';
import { AjaxFetchError } from './AjaxFetchError.js';

const b = 10;
console.log(b);

/**
 * @typedef {import('../types/types.js').RequestInterceptor} RequestInterceptor
 * @typedef {import('../types/types.js').CachedRequestInterceptor} CachedRequestInterceptor
 * @typedef {import('../types/types.js').ResponseInterceptor} ResponseInterceptor
 * @typedef {import('../types/types.js').CachedResponseInterceptor} CachedResponseInterceptor
 * @typedef {import('../types/types.js').ResponseJsonInterceptor} ResponseJsonInterceptor
 * @typedef {import('../types/types.js').AjaxConfig} AjaxConfig
 * @typedef {import('../types/types.js').CacheRequest} CacheRequest
 * @typedef {import('../types/types.js').CacheResponse} CacheResponse
 * @typedef {import('../types/types.js').CacheRequestExtension} CacheRequestExtension
 * @typedef {import('../types/types.js').LionRequestInit} LionRequestInit
 */

/**
 * @param {Response} response
 * @returns {boolean}
 */
function isFailedResponse(response) {
  return response.status >= 400 && response.status < 600;
}

/**
 * A small wrapper around `fetch`.
- Allows globally registering request and response interceptors
- Throws on 4xx and 5xx status codes
- Supports caching, so a request can be prevented from reaching to network, by returning the cached response.
- Supports JSON with `ajax.fetchJson` by automatically serializing request body and
  deserializing response payload as JSON, and adding the correct Content-Type and Accept headers.
- Adds accept-language header to requests based on application language
- Adds XSRF header to request if the cookie is present
 */
export class Ajax {
  /**
   * @param {Partial<AjaxConfig>} config
   */
  constructor(config = {}) {
    /**
     * @type {AjaxConfig}
     * @private
     */
    this.__config = {
      addAcceptLanguage: true,
      addCaching: false,
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',
      xsrfTrustedOrigins: [],
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
    /** @type {Array.<ResponseJsonInterceptor>} */
    this._responseJsonInterceptors = [];

    if (this.__config.addAcceptLanguage) {
      this.addRequestInterceptor(acceptLanguageRequestInterceptor);
    }

    const { xsrfCookieName, xsrfHeaderName, xsrfTrustedOrigins } = this.__config;
    if (xsrfCookieName && xsrfHeaderName && xsrfTrustedOrigins) {
      this.addRequestInterceptor(
        createXsrfRequestInterceptor(xsrfCookieName, xsrfHeaderName, xsrfTrustedOrigins),
      );
    }

    // eslint-disable-next-line prefer-destructuring
    const cacheOptions = /** @type {import('@lion/ajax').CacheOptionsWithIdentifier} */ (
      this.__config.cacheOptions
    );
    if ((cacheOptions && cacheOptions.useCache) || this.__config.addCaching) {
      if (cacheOptions.getCacheIdentifier) {
        const { cacheRequestInterceptor, cacheResponseInterceptor } = createCacheInterceptors(
          cacheOptions.getCacheIdentifier,
          cacheOptions,
        );
        this.addRequestInterceptor(cacheRequestInterceptor);
        this.addResponseInterceptor(cacheResponseInterceptor);
      }
    }
  }

  /**
   * Configures the Ajax instance
   * @param {AjaxConfig} config configuration for the Ajax instance
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

  /** @param {ResponseJsonInterceptor} responseJsonInterceptor */
  addResponseJsonInterceptor(responseJsonInterceptor) {
    this._responseJsonInterceptors.push(responseJsonInterceptor);
  }

  /**
   * Fetch by calling the registered request and response interceptors.
   *
   * @param {RequestInfo} info
   * @param {RequestInit & Partial<CacheRequestExtension>} [init]
   * @param {Boolean} [parseErrorResponse]
   * @returns {Promise<Response>}
   */
  async fetch(info, init, parseErrorResponse = false) {
    const request = /** @type {CacheRequest} */ (new Request(info, { ...init }));
    request.cacheOptions = init?.cacheOptions;
    request.params = init?.params;

    // run request interceptors, returning directly and skipping the network
    const interceptedRequestOrResponse = await this.__interceptRequest(request);
    if (interceptedRequestOrResponse instanceof Response) {
      const response = /** @type {CacheResponse} */ (interceptedRequestOrResponse);
      response.request = request;
      if (isFailedResponse(interceptedRequestOrResponse)) {
        throw new AjaxFetchError(
          request,
          response,
          parseErrorResponse ? await this.__attemptParseFailedResponseBody(response) : undefined,
        );
      }
      // prevent network request, return cached response
      return response;
    }

    const response = /** @type {CacheResponse} */ (await fetch(interceptedRequestOrResponse));
    response.request = interceptedRequestOrResponse;

    const interceptedResponse = await this.__interceptResponse(response);

    if (isFailedResponse(interceptedResponse)) {
      throw new AjaxFetchError(
        request,
        response,
        parseErrorResponse ? await this.__attemptParseFailedResponseBody(response) : undefined,
      );
    }
    return interceptedResponse;
  }

  /**
   * Fetch by calling the registered request and response
   * interceptors. And supports JSON by:
   *  - Serializing request body as JSON
   *  - Deserializing response payload as JSON
   *  - Adding the correct Content-Type and Accept headers
   *
   * @template T
   * @param {RequestInfo} info
   * @param {LionRequestInit} [init]
   * @returns {Promise<{ response: Response, body: string | T }>}
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

    // typecast LionRequestInit back to RequestInit
    const jsonInit = /** @type {RequestInit} */ (lionInit);
    const response = await this.fetch(info, jsonInit, true);

    let body = await this.__parseBody(response);
    if (typeof body === 'object') {
      body = await this.__interceptResponseJson(body, response);
    }

    return { response, body };
  }

  /**
   * @template T
   * @param {Response} response
   * @returns {Promise<string|T>}
   */
  async __parseBody(response) {
    // clone the response, so the consumer can also read it out manually as well
    let responseText = await response.clone().text();

    const { jsonPrefix } = this.__config;
    if (typeof jsonPrefix === 'string' && responseText.startsWith(jsonPrefix)) {
      responseText = responseText.substring(jsonPrefix.length);
    }

    let body = responseText;

    if (
      body.length &&
      (!response.headers.get('content-type') ||
        response.headers.get('content-type')?.includes('json'))
    ) {
      try {
        body = JSON.parse(responseText);
      } catch (error) {
        throw new Error(`Failed to parse response from ${response.url} as JSON.`);
      }
    } else {
      body = responseText;
    }
    return body;
  }

  /**
   * @param {Response} response
   * @returns {Promise<string|Object|undefined>}
   */
  async __attemptParseFailedResponseBody(response) {
    let body;
    try {
      body = await this.__parseBody(response);
    } catch (e) {
      // no need to throw/log, failed responses often don't have a body
    }
    return body;
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
      interceptedResponse = await intercept(/** @type {CacheResponse} */ (interceptedResponse));
    }
    return interceptedResponse;
  }

  /**
   * @param {object} jsonObject
   * @param {Response} response
   * @returns {Promise<object>}
   */
  async __interceptResponseJson(jsonObject, response) {
    let interceptedJsonObject = jsonObject;
    for (const intercept of this._responseJsonInterceptors) {
      // eslint-disable-next-line no-await-in-loop
      interceptedJsonObject = await intercept(interceptedJsonObject, response);
    }
    return interceptedJsonObject;
  }
}
