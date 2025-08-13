import { parseAmount as _parseAmount } from '@lion/ui/input-amount.js';

/**
 * Uses `parseAmount()` to parse a number string and return the best possible javascript number.
 * Rounds up the number with the correct amount of decimals according to the currency.
 *
 * @example
 * parseAmount('1,234.56', {currency: 'EUR'}); => { amount: 1234.56, currency: 'EUR' }
 * parseAmount('1,234.56', {currency: 'JPY'}); => { amount: 1235, currency: 'JPY' }
 * parseAmount('1,234.56', {currency: 'JOD'}); => { amount: 1234.560, currency: 'JOD' }
 *
 * @param {string} value Number to be parsed
 * @param {import('../../localize/types/LocalizeMixinTypes.js').FormatNumberOptions} [givenOptions] Locale Options
 * @returns {import('../types/index.js').AmountDropdownModelValue}
 */
export const parseAmount = (value, givenOptions) => {
  const parsedAmount = _parseAmount(value, givenOptions);

  return {
    amount: parsedAmount,
    currency: givenOptions?.currency,
  };
};
