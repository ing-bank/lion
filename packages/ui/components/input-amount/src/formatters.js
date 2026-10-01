import {
  formatNumber,
  formatNumberToParts,
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
 * @param {FormatNumberOptions} [formatOptions]
 */
export function formatCurrencyLabel(currency, locale, formatOptions) {
  if (currency === '') {
    return '';
  }
  if (formatOptions?.currencyDisplay === 'symbol') {
    const formattedNumber = /** @type {FormatNumberPart[]} */ (
      formatNumberToParts(1, { style: 'currency', locale, currencyDisplay: 'symbol', currency })
    );
    for (let i = 0; i < formattedNumber.length; i += 1) {
      if (formattedNumber[i].type === 'currency') {
        return formattedNumber[i].value;
      }
    }
  }

  return normalizeCurrencyLabel(currency, locale);
}
