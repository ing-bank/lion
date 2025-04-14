import { formatAmount as _formatAmount } from '@lion/ui/input-amount.js';

/**
 * @typedef {import('../../localize/types/LocalizeMixinTypes.js').FormatNumberOptions} FormatOptions
 */

/**
 * Formats a number considering the default fraction digits provided by Intl.
 *
 * @param {import('../types/index.js').AmountDropdownModelValue} modelValue  to format
 * @param {FormatOptions} [givenOptions]
 */
export const formatAmount = (modelValue, givenOptions) =>
  _formatAmount(modelValue?.amount, givenOptions);
