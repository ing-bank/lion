import { localize } from '../localize.js';
import { formatNumberToParts } from './formatNumberToParts.js';

/**
 * Formats a number based on locale and options. It uses Intl for the formatting.
 *
 * @param {number} number Number to be formatted
 * @param {Object} [options] Intl options are available extended by roundMode and returnIfNaN
 * @param {string} [options.roundMode]
 * @param {string} [options.returnIfNaN]
 * @param {string} [options.locale]
 * @param {string} [options.localeMatcher]
 * @param {string} [options.numberingSystem]
 * @param {string} [options.style]
 * @param {string} [options.currency]
 * @param {string} [options.currencyDisplay]
 * @param {boolean}[options.useGrouping]
 * @param {number} [options.minimumIntegerDigits]
 * @param {number} [options.minimumFractionDigits]
 * @param {number} [options.maximumFractionDigits]
 * @param {number} [options.minimumSignificantDigits]
 * @param {number} [options.maximumSignificantDigits]
 * @returns {string}
 */
export function formatNumber(number, options = {}) {
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
    const part = /** @type {{type: string, value: string}} */ (formattedToParts[i]);
    printNumberOfParts += part.value;
  }
  return printNumberOfParts;
}
