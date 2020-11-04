import { getLocale } from './getLocale.js';
import { normalSpaces } from './normalSpaces.js';

/**
 * Gets the group separator
 *
 * @param {string} [locale] To override the browser locale
 * @returns {string}
 */
export function getGroupSeparator(locale) {
  const computedLocale = getLocale(locale);
  const formattedNumber = Intl.NumberFormat(computedLocale, {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(10000);
  return normalSpaces(formattedNumber[2]);
}
