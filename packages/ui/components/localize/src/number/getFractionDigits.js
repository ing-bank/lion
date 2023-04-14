import { formatNumberToParts } from './formatNumberToParts.js';

/**
 * @example
 * getFractionDigits('JOD'); // return 3
 *
 * @typedef {import('../../types/LocalizeMixinTypes.js').FormatNumberPart} FormatNumberPart
 * @param {string} [currency="EUR"] Currency code e.g. EUR
 * @returns {number} fraction for the given currency
 */
export function getFractionDigits(currency = 'EUR') {
  const parts = /** @type {FormatNumberPart[]} */ (
    formatNumberToParts(123, {
      style: 'currency',
      currency,
    })
  );
  const [fractionPart] = parts.filter(part => part.type === 'fraction');
  return fractionPart ? fractionPart.value.length : 0;
}
