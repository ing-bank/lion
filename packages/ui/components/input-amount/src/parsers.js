import { parseNumber, getFractionDigits } from '@lion/ui/localize-no-side-effects.js';

/**
 * @typedef {import('../../localize/types/LocalizeMixinTypes.js').FormatNumberOptions} FormatNumberOptions
 */

/**
 * Rounding problem can be avoided by using numbers represented in exponential notation
 * @param {number} value to be rounded up
 * @param {number | undefined} decimals amount of decimals to keep
 * @return {number} new value with rounded up decimals
 */
function round(value, decimals) {
  const numberContainsExponent = value?.toString().includes('e');
  if (typeof decimals === 'undefined' || numberContainsExponent) {
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
 * @param {FormatNumberOptions} [givenOptions] Locale Options
 */
export function parseAmount(value, givenOptions) {
  const trimmedValue = value.trim();
  const unmatchedInput = trimmedValue.match(/[^0-9,.\-\u2212 ]/g);
  // for the full paste behavior documentation:
  // ./docs/components/input-amount/use-cases.md#paste-behavior
  if (unmatchedInput && givenOptions?.mode !== 'pasted') {
    return undefined;
  }

  const number = parseNumber(trimmedValue, givenOptions);

  if (typeof number !== 'number' || Number.isNaN(number)) {
    return undefined;
  }

  /** @type {FormatNumberOptions} */
  const options = {
    ...givenOptions,
  };

  if (options.currency && typeof options.maximumFractionDigits === 'undefined') {
    options.maximumFractionDigits = getFractionDigits(options.currency);
  }
  return round(number, options.maximumFractionDigits);
}
