/* eslint-disable consistent-return */
import { acceptLanguageRequestTransformer, createXSRFRequestTransformer } from './transformers.js';
import { HttpClientFetchError } from './HttpClientFetchError.js';

/**
 * @typedef {Object} HttpClientConfig configuration for the HttpClient instance
 * @property {boolean} addAcceptLanguage the Accept-Language request HTTP header advertises
 * which languages the client is able to understand, and which locale variant is preferred.
 * @property {string} [xsrfCookieName] name of the XSRF cookie to read from
 * @property {string} [xsrfHeaderName] name of the XSRF header to set
 * @property {string} [jsonPrefix] the json prefix to use when fetching json (if any)
 */

/**
 * Transforms a Request before fetching. Must return an instance of Request or Response.
 * If a Respone is returned, the network call is skipped and it is returned as is.
 * @typedef {(request: Request) => Request | Response} RequestTransformer
 */

/**
 * Transforms a Response before returning. Must return an instance of Response.
 * @typedef {(response: Response) => Response} ResponseTransformer
 */

/**
 * HTTP Client which acts as a small wrapper around `fetch`. Allows registering hooks which
 * transform request and responses, for example to add authorization headers or logging. A
 * request can also be prevented from reaching the network at all by returning the Response directly.
 */
export class HttpClient {
  /**
   * @param {HttpClientConfig} config
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
    /** @type {RequestTransformer[]} */
    this._requestTransformers = [];
    /** @type {ResponseTransformer[]} */
    this._responseTransformers = [];

    if (addAcceptLanguage) {
      this.addRequestTransformer(acceptLanguageRequestTransformer);
    }

    if (xsrfCookieName && xsrfHeaderName) {
      this.addRequestTransformer(createXSRFRequestTransformer(xsrfCookieName, xsrfHeaderName));
    }
  }

  /** @param {RequestTransformer} requestTransformer */
  addRequestTransformer(requestTransformer) {
    this._requestTransformers.push(requestTransformer);
  }

  /** @param {RequestTransformer} requestTransformer */
  removeRequestTransformer(requestTransformer) {
    const indexOf = this._requestTransformers.indexOf(requestTransformer);
    if (indexOf !== -1) {
      this._requestTransformers.splice(indexOf);
    }
  }

  /** @param {ResponseTransformer} responseTransformer */
  addResponseTransformer(responseTransformer) {
    this._responseTransformers.push(responseTransformer);
  }

  /** @param {ResponseTransformer} responseTransformer */
  removeResponseTransformer(responseTransformer) {
    const indexOf = this._responseTransformers.indexOf(responseTransformer);
    if (indexOf !== -1) {
      this._responseTransformers.splice(indexOf, 1);
    }
  }

  /**
   * Makes a fetch request, calling the registered fetch request and response
   * transformers.
   *
   * @param {RequestInfo} info
   * @param {RequestInit} [init]
   * @returns {Promise<Response>}
   */
  async request(info, init) {
    const request = new Request(info, init);
    /** @type {Request | Response} */
    let transformedRequestOrResponse = request;

    // run request transformers, returning directly and skipping the network
    // if a transformer returns a Response
    this._requestTransformers.forEach(transform => {
      transformedRequestOrResponse = transform(transformedRequestOrResponse);
      if (transformedRequestOrResponse instanceof Response) {
        return transformedRequestOrResponse;
      }
    });

    const response = await fetch(transformedRequestOrResponse);
    const transformedResponse = this._responseTransformers.reduce(
      (prev, transform) => transform(prev),
      response,
    );
    if (transformedResponse.status >= 400 && transformedResponse.status < 600) {
      throw new HttpClientFetchError(request, transformedResponse);
    }
    return transformedResponse;
  }

  /**
   * Makes a fetch request, calling the registered fetch request and response
   * transformers. Encodes/decodes the request and response body as JSON.
   *
   * @param {RequestInfo} info
   * @param {RequestInit} [init]
   * @template T
   * @returns {Promise<{ response: Response, body: T }>}
   */
  async requestJson(info, init) {
    const jsonInit = {
      ...init,
      headers: {
        ...(init && init.headers),
        accept: 'application/json',
      },
    };

    if (init && init.body) {
      jsonInit.headers['content-type'] = 'application/json';
      jsonInit.body = JSON.stringify(init.body);
    }

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
