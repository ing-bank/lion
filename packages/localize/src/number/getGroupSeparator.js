import { getLocale } from './getLocale.js';
import { normalSpaces } from './normalSpaces.js';

/**
 * To get the group separator
 *
 * @param {string} locale To override the browser locale
 * @returns {Object} the separator
 */
export function getGroupSeparator(locale) {
  const computedLocale = getLocale(locale);
  const formattedNumber = Intl.NumberFormat(computedLocale, {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format('1000');
  return normalSpaces(formattedNumber[1]);
}
