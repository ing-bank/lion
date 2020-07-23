/**
 *
 * @param {any} formattedParts
 * @param {Object} [options]
 * @param {string} [options.currency]
 * @param {string} [options.currencyDisplay]
 * @returns {any}
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
