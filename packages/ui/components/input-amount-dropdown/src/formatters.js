import { formatAmount as _formatAmount } from '@lion/ui/input-amount.js';
import { currencyUtil } from './currencyUtil.js';

/**
 * @typedef {import('../../localize/types/LocalizeMixinTypes.js').FormatNumberOptions} FormatOptions
 * @typedef {import('../types/index.js').AmountDropdownModelValue} AmountDropdownModelValue
 */

/**
 * Formats a number considering the default fraction digits provided by Intl.
 *
 * @param {import('../types/index.js').AmountDropdownModelValue} modelValue  to format
 * @param {FormatOptions} [givenOptions]
 * @param {AmountDropdownModelValue|undefined} [context]
 */
export const formatAmount = (modelValue, givenOptions, context) => {
  // @ts-expect-error - cannot cast string to CurrencyCode outside a TS file
  if (currencyUtil.allCurrencies.has(modelValue?.currency) && context) {
    // TODO: better way of setting parent currency
    context.currency = modelValue?.currency;
  }
  // @ts-expect-error - cannot cast string to CurrencyCode outside a TS file
  return _formatAmount(modelValue?.amount, givenOptions);
};
