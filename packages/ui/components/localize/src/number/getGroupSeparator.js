import { getLocale } from '../utils/getLocale.js';
import { normalSpaces } from './utils/normalSpaces.js';

/**
 * Gets the group separator
 *
 * @param {string} [locale] To override the browser locale
 * @param {import('../../types/LocalizeMixinTypes.js').FormatNumberOptions} [options]
 * @returns {string}
 */
export function getGroupSeparator(locale, options) {
  if (options && options.groupSeparator) {
    return options.groupSeparator;
  }
  const computedLocale = getLocale(locale);
  const formattedNumber = Intl.NumberFormat(computedLocale, {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(10000);
  return normalSpaces(formattedNumber[2]);
}
