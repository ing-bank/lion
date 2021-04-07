import './typedef.js';

/**
 * @param {string} name the cookie name
 * @param {Document | { cookie: string }} _document overwriteable for testing
 * @returns {string | null}
 */
export function getCookie(name, _document = document) {
  const match = _document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
  return match ? decodeURIComponent(match[3]) : null;
}

/**
 * Transforms a request, adding an accept-language header with the current application's locale
 * if it has not already been set.
 * @type {RequestInterceptor}
 */
export async function acceptLanguageRequestInterceptor(request) {
  if (!request.headers.has('accept-language')) {
    const documentLocale = document.documentElement.lang;
    const localizeLang = document.documentElement.getAttribute('data-localize-lang');
    const locale = localizeLang || documentLocale || 'en';
    request.headers.set('accept-language', locale);
  }
  return request;
}

/**
 * Creates a request transformer that adds a XSRF header for protecting
 * against cross-site request forgery.
 * @param {string} cookieName the cookie name
 * @param {string} headerName the header name
 * @param {Document | { cookie: string }} _document overwriteable for testing
 * @returns {RequestInterceptor}
 */
export function createXSRFRequestInterceptor(cookieName, headerName, _document = document) {
  /**
   * @type {RequestInterceptor}
   */
  async function xsrfRequestInterceptor(request) {
    const xsrfToken = getCookie(cookieName, _document);
    if (xsrfToken) {
      request.headers.set(headerName, xsrfToken);
    }
    return request;
  }

  return xsrfRequestInterceptor;
}
