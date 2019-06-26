import { localize } from '../localize.js';
import { formatNumberToParts } from './formatNumberToParts.js';

/**
 * Formats a number based on locale and options. It uses Intl for the formatting.
 *
 * @param {number} number Number to be formatted
 * @param {Object} options Intl options are available extended by roundMode
 * @returns {*} Formatted number
 */
export function formatNumber(number, options) {
  if (number === undefined || number === null) return '';
  const formattedToParts = formatNumberToParts(number, options);
  // If number is not a number
  if (
    formattedToParts === (options && options.returnIfNaN) ||
    formattedToParts === localize.formatNumberOptions.returnIfNaN
  ) {
    return formattedToParts;
  }
  let printNumberOfParts = '';
  // update numberOfParts because there may be some parts added
  const numberOfParts = formattedToParts && formattedToParts.length;
  for (let i = 0; i < numberOfParts; i += 1) {
    printNumberOfParts += formattedToParts[i].value;
  }
  return printNumberOfParts;
}
