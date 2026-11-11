import {
  formatNumber,
  getFractionDigits,
  normalizeCurrencyLabel,
} from '@lion/ui/localize-no-side-effects.js';

/**
 * @typedef {import('../../localize/types/LocalizeMixinTypes.js').FormatNumberOptions} FormatNumberOptions
 * @typedef {import('../../localize/types/LocalizeMixinTypes.js').FormatNumberPart} FormatNumberPart
 */

/**
 * Formats a number considering the default fraction digits provided by Intl.
 *
 * @param {number} modelValue Number to format
 * @param {FormatNumberOptions} [givenOptions]
 */
export function formatAmount(modelValue, givenOptions) {
  /** @type {FormatNumberOptions} */
  const options = {
    currency: 'EUR',
    ...givenOptions,
  };

  if (typeof options.minimumFractionDigits === 'undefined') {
    options.minimumFractionDigits = getFractionDigits(options.currency);
  }
  if (typeof options.maximumFractionDigits === 'undefined') {
    options.maximumFractionDigits = getFractionDigits(options.currency);
  }

  return formatNumber(modelValue, options);
}

/**
 *
 * @param {string} currency
 * @param {string} locale
 */
export function formatCurrencyLabel(currency, locale) {
  if (currency === '') {
    return '';
  }

  return normalizeCurrencyLabel(currency, locale);
}
