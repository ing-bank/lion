import { axios } from '@bundled-es-modules/axios';
import {
  cancelInterceptorFactory,
  cancelPreviousOnNewRequestInterceptorFactory,
  addAcceptLanguageHeaderInterceptorFactory,
} from './interceptors.js';
import { jsonPrefixTransformerFactory } from './transformers.js';

/**
 * `AjaxClass` creates the singleton instance {@link:ajax}. It is a promise based system for
 * fetching data, based on [axios](https://github.com/axios/axios).
 */
export class AjaxClass {
  /**
   * @property {Object} proxy the axios instance that is bound to the AjaxClass instance
   */

  /**
   * @param {Object} config configuration for the AjaxClass instance
   * @param {string} config.jsonPrefix prefixing the JSON string in this manner is used to help
   * prevent JSON Hijacking. The prefix renders the string syntactically invalid as a script so
   * that it cannot be hijacked. This prefix should be stripped before parsing the string as JSON.
   * @param {string} config.lang language
   * @param {string} config.languageHeader the Accept-Language request HTTP header advertises
   * which languages the client is able to understand, and which locale variant is preferred.
   * @param {string} config.cancelable if request can be canceled
   * @param {string} config.cancelPreviousOnNewRequest prevents concurrent requests
   */
  constructor(config) {
    this.__config = {
      lang: document.documentElement.getAttribute('lang'),
      languageHeader: true,
      cancelable: false,
      cancelPreviousOnNewRequest: false,
      ...config,
    };

    this.proxy = axios.create(this.__config);
    this.__setupInterceptors();

    this.requestInterceptors = [];
    this.requestErrorInterceptors = [];

    this.requestDataTransformers = [];
    this.requestDataErrorTransformers = [];

    this.responseDataTransformers = [];
    this.responseDataErrorTransformers = [];

    this.responseInterceptors = [];
    this.responseErrorInterceptors = [];

    this.__isInterceptorsSetup = false;

    if (this.__config.languageHeader) {
      this.requestInterceptors.push(addAcceptLanguageHeaderInterceptorFactory(this.__config.lang));
    }

    if (this.__config.cancelable) {
      this.requestInterceptors.push(cancelInterceptorFactory(this));
    }

    if (this.__config.cancelPreviousOnNewRequest) {
      this.requestInterceptors.push(cancelPreviousOnNewRequestInterceptorFactory());
    }

    if (this.__config.jsonPrefix) {
      const transformer = jsonPrefixTransformerFactory(this.__config.jsonPrefix);
      this.responseDataTransformers.push(transformer);
    }
  }

  /**
   * Sets the config for the instance
   */
  set options(config) {
    this.__config = config;
  }

  get options() {
    return this.__config;
  }

  /**
   * Dispatches a request
   * @see https://github.com/axios/axios
   * @param {AxiosRequestConfig} config the config specific for this request
   * @returns {AxiosResponseSchema}
   */
  request(url, config) {
    return this.proxy.request.apply(this, [url, { ...this.__config, ...config }]);
  }

  /**
   * Dispatches a {@link AxiosRequestConfig} with method 'get' predefined
   * @param {string} url the endpoint location
   * @param {AxiosRequestConfig} config the config specific for this request
   * @returns {AxiosResponseSchema}
   */
  get(url, config) {
    return this.proxy.get.apply(this, [url, { ...this.__config, ...config }]);
  }

  /**
   * Dispatches a {@link AxiosRequestConfig} with method 'delete' predefined
   * @param {string} url the endpoint location
   * @param {AxiosRequestConfig} config the config specific for this request
   * @returns {AxiosResponseSchema}
   */
  delete(url, config) {
    return this.proxy.delete.apply(this, [url, { ...this.__config, ...config }]);
  }

  /**
   * Dispatches a {@link AxiosRequestConfig} with method 'head' predefined
   * @param {string} url the endpoint location
   * @param {AxiosRequestConfig} config the config specific for this request
   * @returns {AxiosResponseSchema}
   */
  head(url, config) {
    return this.proxy.head.apply(this, [url, { ...this.__config, ...config }]);
  }

  /**
   * Dispatches a {@link AxiosRequestConfig} with method 'options' predefined
   * @param {string} url the endpoint location
   * @param {AxiosRequestConfig} config the config specific for this request
   * @returns {AxiosResponseSchema}
   */
  // options(url, config) {
  //   return this.proxy.options.apply(this, [url, { ...this.__config, ...config }]);
  // }

  /**
   * Dispatches a {@link AxiosRequestConfig} with method 'post' predefined
   * @param {string} url the endpoint location
   * @param {Object} data the data to be sent to the endpoint
   * @param {AxiosRequestConfig} config the config specific for this request
   * @returns {AxiosResponseSchema}
   */
  post(url, data, config) {
    return this.proxy.post.apply(this, [url, data, { ...this.__config, ...config }]);
  }

  /**
   * Dispatches a {@link AxiosRequestConfig} with method 'put' predefined
   * @param {string} url the endpoint location
   * @param {Object} data the data to be sent to the endpoint
   * @param {AxiosRequestConfig} config the config specific for this request
   * @returns {AxiosResponseSchema}
   */
  put(url, data, config) {
    return this.proxy.put.apply(this, [url, data, { ...this.__config, ...config }]);
  }

  /**
   * Dispatches a {@link AxiosRequestConfig} with method 'patch' predefined
   * @see https://github.com/axios/axios (Request Config)
   * @param {string} url the endpoint location
   * @param {Object} data the data to be sent to the endpoint
   * @param {Object} config the config specific for this request.
   * @returns {AxiosResponseSchema}
   */
  patch(url, data, config) {
    return this.proxy.patch.apply(this, [url, data, { ...this.__config, ...config }]);
  }

  __setupInterceptors() {
    this.proxy.interceptors.request.use(
      config => {
        const configWithTransformers = this.__setupTransformers(config);
        return this.requestInterceptors.reduce((c, i) => i(c), configWithTransformers);
      },
      error => {
        this.requestErrorInterceptors.forEach(i => i(error));
        return Promise.reject(error);
      },
    );

    this.proxy.interceptors.response.use(
      response => this.responseInterceptors.reduce((r, i) => i(r), response),
      error => {
        this.responseErrorInterceptors.forEach(i => i(error));
        return Promise.reject(error);
      },
    );
  }

  __setupTransformers(config) {
    const axiosTransformRequest = config.transformRequest[0];
    const axiosTransformResponse = config.transformResponse[0];
    return {
      ...config,
      transformRequest: (data, headers) => {
        try {
          const ourData = this.requestDataTransformers.reduce((d, t) => t(d, headers), data);
          // axios does a lot of smart things with the request that people rely on
          // and must be the last request data transformer to do this job
          return axiosTransformRequest(ourData, headers);
        } catch (error) {
          this.requestDataErrorTransformers.forEach(t => t(error));
          throw error;
        }
      },
      transformResponse: data => {
        try {
          // axios does a lot of smart things with the response that people rely on
          // and must be the first response data transformer to do this job
          const axiosData = axiosTransformResponse(data);
          return this.responseDataTransformers.reduce((d, t) => t(d), axiosData);
        } catch (error) {
          this.responseDataErrorTransformers.forEach(t => t(error));
          throw error;
        }
      },
    };
  }
}
