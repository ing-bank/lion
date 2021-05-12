import '../typedef.js';

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
