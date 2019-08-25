import { localize } from '@lion/localize';

/**
 * @typedef {import('./HttpClient').RequestTransformer} RequestTransformer
 */

/**
 * @param {string} name the cookie name
 * @param {Document} _document overwriteable for testing
 * @returns {string | null}
 */
export function getCookie(name, _document = document) {
  const match = _document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
  return match ? decodeURIComponent(match[3]) : null;
}

/**
 * Transforms a request, adding an accept-language header with the current application's locale
 * if it has not already been set.
 * @type {RequestTransformer}
 */
export function acceptLanguageRequestTransformer(request) {
  if (!request.headers.has('accept-language')) {
    request.headers.set('accept-language', localize.locale);
  }
  return request;
}

/**
 * Creates a request transformer that adds a XSRF header for protecting
 * against cross-site request forgery.
 * @param {string} cookieName the cookie name
 * @param {string} headerName the header name
 * @param {Document} _document overwriteable for testing
 * @returns {RequestTransformer}
 */
export function createXSRFRequestTransformer(cookieName, headerName, _document = document) {
  /**
   * @type {RequestTransformer}
   */
  function xsrfRequestTransformer(request) {
    const xsrfToken = getCookie(cookieName, _document);
    if (xsrfToken) {
      request.headers.set(headerName, xsrfToken);
    }
    return request;
  }

  return xsrfRequestTransformer;
}
