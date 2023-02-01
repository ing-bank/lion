import { getLocalizeManager } from '../getLocalizeManager.js';

/**
 * Gets the locale to use
 *
 * @param {string} [locale] Locale to override browser locale
 * @returns {string}
 */
export function getLocale(locale) {
  const localizeManager = getLocalizeManager();
  return locale || localizeManager?.locale || 'en-GB';
}
