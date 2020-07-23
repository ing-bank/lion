import { formatNumberToParts } from './formatNumberToParts.js';

/**
 * @typedef {import('../../types/localizeTypes').FormatNumberPart} FormatNumberPart
 */

/**
 * @example
 * getFractionDigits('JOD'); // return 3
 *
 * @param {string} [currency="EUR"] Currency code e.g. EUR
 * @returns {number} fraction for the given currency
 */
export function getFractionDigits(currency = 'EUR') {
  const parts = /** @type {FormatNumberPart[]} */ (formatNumberToParts(123, {
    style: 'currency',
    currency,
  }));
  const [fractionPart] = parts.filter(part => part.type === 'fraction');
  return fractionPart ? fractionPart.value.length : 0;
}
