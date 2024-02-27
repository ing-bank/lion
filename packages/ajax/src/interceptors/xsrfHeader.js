/**
 * @typedef {import('../../types/types.js').RequestInterceptor} RequestInterceptor
 */

/**
* Parse a URL to discover it's components
*
* @param {String | object} url The URL to be parsed
* @returns {{protocol: string, host: string }}
*/
function resolveURL(url) {
  if (typeof url !== 'string') {
    return url;
  }
  let href = url;
  let urlParsingNode = document.createElement('a');
  urlParsingNode.setAttribute('href', href);

  // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
  return {
    protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
    host: urlParsingNode.host,
  };
}

/**
 * Determine if two URLs share the same origin.
 *
 * @param {string| object} url1 - First URL to compare as a string or a normalized URL in the form of
 *     a dictionary object returned by `urlResolve()`.
 * @param {string | object} url2 - Second URL to compare as a string or a normalized URL in the form
 *     of a dictionary object returned by `urlResolve()`.
 *
 * @returns {boolean} - True if both URLs have the same origin, and false otherwise.
 */
function urlsAreSameOrigin(url1, url2) {
  const parsedUrl1 = resolveURL(url1);
  const parsedUrl2 = resolveURL(url2);

  return (parsedUrl1.protocol === parsedUrl2.protocol &&
    parsedUrl1.host === parsedUrl2.host);
}

/**
* Check if the URL provided has the same origin as the one used.
* Or if it is for a trusted XSRF origin.
*
* @param {String} requestURL The requestedURL
* @param {string[]} xsrfTrustedOrigins List of allowed origins
* @returns {boolean} true if it is the same origin, else false
*/
function isURLTrustedOrSameOrigin(requestURL, xsrfTrustedOrigins) {
  const parsed = (typeof requestURL === 'string') ? resolveURL(requestURL) : requestURL;
  const originURL = resolveURL(window.location.href);
  const parsedAllowedOriginUrls = [originURL].concat(xsrfTrustedOrigins.map(resolveURL));

  return parsedAllowedOriginUrls.some(urlsAreSameOrigin.bind(null, parsed));
}

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
 * @param {string[]} xsrfTrustedOrigins List of trusted origins
 * @param {Document | { cookie: string }} _document overwriteable for testing
 * @returns {RequestInterceptor}
 */
export function createXsrfRequestInterceptor(cookieName, headerName, xsrfTrustedOrigins, _document = document) {
  /**
   * @param {Request} request
   */
  async function xsrfRequestInterceptor(request) {
    const xsrfToken = getCookie(cookieName, _document);

    const isSameSite = isURLTrustedOrSameOrigin(request.url, xsrfTrustedOrigins);

    // Only add the XSRF token when it is needed and/or allowed.
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method) && isSameSite && xsrfToken) {
      request.headers.set(headerName, xsrfToken);
    }
    return request;
  }

  return xsrfRequestInterceptor;
}

