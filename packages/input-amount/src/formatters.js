import { formatNumber, getFractionDigits, normalizeCurrencyLabel } from '@lion/localize';

/**
 * Formats a number considering the default fraction digits provided by Intl.
 *
 * @param {float} modelValue Number to format
 * @param {object} givenOptions Options for Intl
 */
export function formatAmount(modelValue, givenOptions) {
  if (modelValue === '') {
    return '';
  }
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

export function formatCurrencyLabel(currency, locale) {
  if (currency === '') {
    return '';
  }
  return normalizeCurrencyLabel(currency, locale);
}
