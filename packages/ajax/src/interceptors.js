// @ts-ignore no types for bundled-es-modules/axios
import { axios } from '@bundled-es-modules/axios';

/**
 * @param {string} [lang]
 * @return {(config: {[key:string]: ?}) => {[key:string]: ?}}
 */
export function addAcceptLanguageHeaderInterceptorFactory(lang) {
  console.log('add language header');
  console.log(lang);
  return /** @param {{[key:string]: ?}} config */ config => {
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

/**
 * @param {import('./AjaxClass').AjaxClass} ajaxInstance
 * @return {(config: {[key:string]: ?}) => {[key:string]: ?}}
 */
export function cancelInterceptorFactory(ajaxInstance) {
  /** @type {unknown[]} */
  const cancelSources = [];
  return /** @param {{[key:string]: ?}} config */ config => {
    const source = axios.CancelToken.source();
    cancelSources.push(source);
    /* eslint-disable-next-line no-param-reassign */
    ajaxInstance.cancel = (message = 'Operation canceled by the user.') => {
      // @ts-ignore axios is untyped so we don't know the type for the source
      cancelSources.forEach(s => s.cancel(message));
    };
    return { ...config, cancelToken: source.token };
  };
}

/**
 * @return {(config: {[key:string]: ?}) => {[key:string]: ?}}
 */
export function cancelPreviousOnNewRequestInterceptorFactory() {
  // @ts-ignore axios is untyped so we don't know the type for the source
  let prevCancelSource;
  return /** @param {{[key:string]: ?}} config */ config => {
    // @ts-ignore axios is untyped so we don't know the type for the source
    if (prevCancelSource) {
      // @ts-ignore
      prevCancelSource.cancel('Concurrent requests not allowed.');
    }
    const source = axios.CancelToken.source();
    prevCancelSource = source;
    return { ...config, cancelToken: source.token };
  };
}
