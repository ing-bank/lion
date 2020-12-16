/* eslint-disable consistent-return */
import { acceptLanguageRequestInterceptor, createXSRFRequestInterceptor } from './interceptors.js';
import { AjaxClientFetchError } from './AjaxClientFetchError.js';

/**
 * @typedef {Object} AjaxClientConfig configuration for the AjaxClient instance
 * @property {boolean} [addAcceptLanguage] the Accept-Language request HTTP header advertises
 * which languages the client is able to understand, and which locale variant is preferred.
 * @property {string|null} [xsrfCookieName] name of the XSRF cookie to read from
 * @property {string|null} [xsrfHeaderName] name of the XSRF header to set
 * @property {string} [jsonPrefix] the json prefix to use when fetching json (if any)
 */

/**
 * Intercepts a Request before fetching. Must return an instance of Request or Response.
 * If a Respone is returned, the network call is skipped and it is returned as is.
 * @typedef {(request: Request) => Promise<Request | Response>} RequestInterceptor
 */

/**
 * Intercepts a Response before returning. Must return an instance of Response.
 * @typedef {(response: Response) => Promise<Response>} ResponseInterceptor
 */

/**
 * Overrides the body property to also allow javascript objects
 * as they get string encoded automatically
 * @typedef {import('../types/ajaxClientTypes').LionRequestInit} LionRequestInit
 */

/**
 * HTTP Client which acts as a small wrapper around `fetch`. Allows registering hooks which
 * intercept request and responses, for example to add authorization headers or logging. A
 * request can also be prevented from reaching the network at all by returning the Response directly.
 */
export class AjaxClient {
  /**
   * @param {AjaxClientConfig} config
   */
  constructor(config = {}) {
    const {
      addAcceptLanguage = true,
      xsrfCookieName = 'XSRF-TOKEN',
      xsrfHeaderName = 'X-XSRF-TOKEN',
      jsonPrefix,
    } = config;

    /** @type {string | undefined} */
    this._jsonPrefix = jsonPrefix;
    /** @type {RequestInterceptor[]} */
    this._requestInterceptors = [];
    /** @type {ResponseInterceptor[]} */
    this._responseInterceptors = [];

    if (addAcceptLanguage) {
      this.addRequestInterceptor(acceptLanguageRequestInterceptor);
    }

    if (xsrfCookieName && xsrfHeaderName) {
      this.addRequestInterceptor(createXSRFRequestInterceptor(xsrfCookieName, xsrfHeaderName));
    }
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
   * @param {RequestInit} [init]
   * @returns {Promise<Response>}
   */
  async request(info, init) {
    const request = new Request(info, init);

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

    const response = await fetch(interceptedRequest);

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

    if (typeof this._jsonPrefix === 'string') {
      if (responseText.startsWith(this._jsonPrefix)) {
        responseText = responseText.substring(this._jsonPrefix.length);
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
