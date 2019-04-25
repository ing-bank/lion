/* eslint-disable no-underscore-dangle */

import { axios } from '@bundled-es-modules/axios';

// FIXME: lang must be dynamic, fallback to html tag lang attribute or use the user-provided one
export function addAcceptLanguageHeaderInterceptorFactory(lang) {
  return config => {
    const result = config;
    if (typeof lang === 'string' && lang !== '') {
      if (typeof result.headers !== 'object') {
        result.headers = {};
      }
      const withLang = { headers: { 'Accept-Language': lang, ...result.headers } };
      return { ...result, ...withLang };
    }
    return result;
  };
}

export function cancelInterceptorFactory(ajaxInstance) {
  const cancelSources = [];
  return config => {
    const source = axios.CancelToken.source();
    cancelSources.push(source);
    /* eslint-disable-next-line no-param-reassign */
    ajaxInstance.cancel = (message = 'Operation canceled by the user.') => {
      cancelSources.forEach(s => s.cancel(message));
    };
    return { ...config, cancelToken: source.token };
  };
}

export function cancelPreviousOnNewRequestInterceptorFactory() {
  let prevCancelSource;
  return config => {
    if (prevCancelSource) {
      prevCancelSource.cancel('Concurrent requests not allowed.');
    }
    const source = axios.CancelToken.source();
    prevCancelSource = source;
    return { ...config, cancelToken: source.token };
  };
}
