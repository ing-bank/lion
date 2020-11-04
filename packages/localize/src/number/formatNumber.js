import { localize } from '../localize.js';
import { formatNumberToParts } from './formatNumberToParts.js';

/**
 * Formats a number based on locale and options. It uses Intl for the formatting.
 *
 * @typedef {import('../../types/LocalizeMixinTypes').FormatNumberPart} FormatNumberPart
 * @typedef {import('@lion/localize/types/LocalizeMixinTypes').FormatNumberOptions} FormatOptions
 * @param {number} number Number to be formatted
 * @param {FormatOptions} [options] Intl options are available extended by roundMode and returnIfNaN
 * @returns {string}
 */
export function formatNumber(number, options = /** @type {FormatOptions} */ ({})) {
  if (number === undefined || number === null) return '';
  const formattedToParts = formatNumberToParts(number, options);
  // If number is not a number
  if (
    formattedToParts === options.returnIfNaN ||
    formattedToParts === localize.formatNumberOptions.returnIfNaN
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
  return printNumberOfParts;
}
