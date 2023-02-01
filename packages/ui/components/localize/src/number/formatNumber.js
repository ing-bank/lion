/** @typedef {import('../../types/LocalizeMixinTypes.js').NumberPostProcessor} NumberPostProcessor */

import { getLocalizeManager } from '../getLocalizeManager.js';
import { getLocale } from '../utils/getLocale.js';
import { formatNumberToParts } from './formatNumberToParts.js';

/**
 * Formats a number based on locale and options. It uses Intl for the formatting.
 *
 * @typedef {import('../../types/LocalizeMixinTypes.js').FormatNumberPart} FormatNumberPart
 * @typedef {import('../../types/LocalizeMixinTypes.js').FormatNumberOptions} FormatOptions
 * @param {number} number Number to be formatted
 * @param {FormatOptions} [options] Intl options are available extended by roundMode and returnIfNaN
 * @returns {string}
 */
export function formatNumber(number, options = /** @type {FormatOptions} */ ({})) {
  const localizeManager = getLocalizeManager();
  if (number === undefined || number === null) return '';
  const formattedToParts = formatNumberToParts(number, options);
  // If number is not a number
  if (
    formattedToParts === options.returnIfNaN ||
    formattedToParts === localizeManager.formatNumberOptions.returnIfNaN
  ) {
    return /** @type {string} */ (formattedToParts);
  }
  let printNumberOfParts = '';
  // update numberOfParts because there may be some parts added
  const numberOfParts = formattedToParts && formattedToParts.length;
  for (let i = 0; i < numberOfParts; i += 1) {
    const part = /** @type {FormatNumberPart} */ (formattedToParts[i]);
    printNumberOfParts += part.value;
  }

  const computedLocale = getLocale(options && options.locale);

  if (localizeManager.formatNumberOptions.postProcessors.size > 0) {
    Array.from(localizeManager.formatNumberOptions.postProcessors).forEach(([locale, fn]) => {
      if (locale === computedLocale) {
        printNumberOfParts = fn(printNumberOfParts);
      }
    });
  }

  if (options.postProcessors && options.postProcessors.size > 0) {
    Array.from(options.postProcessors).forEach(([locale, fn]) => {
      if (locale === computedLocale) {
        printNumberOfParts = fn(printNumberOfParts);
      }
    });
  }

  return printNumberOfParts;
}
