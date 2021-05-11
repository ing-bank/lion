import '../typedef.js';

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
 * Creates a request transformer that adds a XSRF header for protecting
 * against cross-site request forgery.
 * @param {string} cookieName the cookie name
 * @param {string} headerName the header name
 * @param {Document | { cookie: string }} _document overwriteable for testing
 * @returns {RequestInterceptor}
 */
export function createXsrfRequestInterceptor(cookieName, headerName, _document = document) {
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
