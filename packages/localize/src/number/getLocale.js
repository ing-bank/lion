import { localize } from '../localize.js';

/**
 * Gets the locale to use
 *
 * @param {string} locale Locale to override browser locale
 * @returns {string}
 */
export function getLocale(locale) {
  if (locale) {
    return locale;
  }
  if (localize && localize.locale) {
    return localize.locale;
  }
  return 'en-GB';
}
