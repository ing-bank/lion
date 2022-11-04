import { parseNumber, getFractionDigits } from '@lion/ui/localize.js';

/**
 * @typedef {import('../../localize/types/LocalizeMixinTypes.js').FormatNumberOptions} FormatOptions
 */

/**
 * Rounding problem can be avoided by using numbers represented in exponential notation
 * @param {number} value to be rounded up
 * @param {number | undefined} decimals amount of decimals to keep
 * @return {number} new value with rounded up decimals
 */
function round(value, decimals) {
  if (typeof decimals === 'undefined') {
    return Number(value);
  }
  return Number(`${Math.round(Number(`${value}e${decimals}`))}e-${decimals}`);
}

/**
 * Uses `parseNumber()` to parses a number string and returns the best possible javascript number.
 * Rounds up the number with the correct amount of decimals according to the currency.
 *
 * @example
 * parseAmount('1,234.56', {currency: 'EUR'}); => 1234.56
 * parseAmount('1,234.56', {currency: 'JPY'}); => 1235
 * parseAmount('1,234.56', {currency: 'JOD'}); => 1234.560
 *
 * @param {string} value Number to be parsed
 * @param {FormatOptions} [givenOptions] Locale Options
 */
export function parseAmount(value, givenOptions) {
  const number = parseNumber(value, givenOptions);

  if (typeof number !== 'number') {
    return number;
  }

  /** @type {FormatOptions} */
  const options = {
    ...givenOptions,
  };

  if (options.currency && typeof options.maximumFractionDigits === 'undefined') {
    options.maximumFractionDigits = getFractionDigits(options.currency);
  }
  return round(number, options.maximumFractionDigits);
}
