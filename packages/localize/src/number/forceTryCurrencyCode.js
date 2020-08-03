/**
 * @typedef {import('../../types/LocalizeMixinTypes').FormatNumberPart} FormatNumberPart
 * @param {FormatNumberPart[]} formattedParts
 * @param {Object} [options]
 * @param {string} [options.currency]
 * @param {string} [options.currencyDisplay]
 * @returns {FormatNumberPart[]}
 */
export function forceTryCurrencyCode(formattedParts, { currency, currencyDisplay } = {}) {
  const result = formattedParts;
  // Change the currency code from TRY to TL, for Turkey
  if (currency === 'TRY' && currencyDisplay === 'code') {
    if (result[0].value === 'TRY') {
      result[0].value = 'TL';
    }
  }
  return result;
}
