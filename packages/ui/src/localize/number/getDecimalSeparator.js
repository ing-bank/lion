import { getLocale } from '../utils/getLocale.js';

/**
 * To get the decimal separator
 *
 * @param {string} [locale] To override the browser locale
 * @param {import('../../types/LocalizeMixinTypes').FormatNumberOptions} [options]
 * @returns {string} The separator
 */
export function getDecimalSeparator(locale, options) {
  if (options && options.decimalSeparator) {
    return options.decimalSeparator;
  }
  const computedLocale = getLocale(locale);
  const formattedNumber = Intl.NumberFormat(computedLocale, {
    style: 'decimal',
    minimumFractionDigits: 1,
  }).format(1);
  return formattedNumber[1];
}
