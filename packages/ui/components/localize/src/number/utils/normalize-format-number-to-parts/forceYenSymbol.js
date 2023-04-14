/**
 * @typedef {import('../../../../types/LocalizeMixinTypes.js').FormatNumberPart} FormatNumberPart
 * @param {FormatNumberPart[]} formattedParts
 * @param {import('../../../../types/LocalizeMixinTypes.js').FormatNumberOptions} options
 * @returns {FormatNumberPart[]}
 */
export function forceYenSymbol(formattedParts, { currency, currencyDisplay } = {}) {
  const result = formattedParts;
  const numberOfParts = result.length;
  // Change the symbol from JPY to ¥, due to bug in Chrome
  if (numberOfParts > 1 && currency === 'JPY' && currencyDisplay === 'symbol') {
    result[numberOfParts - 1].value = '¥';
  }
  return result;
}
