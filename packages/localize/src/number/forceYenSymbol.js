export function forceYenSymbol(formattedParts, options) {
  const result = formattedParts;
  const numberOfParts = result.length;
  // Change the symbol from JPY to ¥, due to bug in Chrome
  if (
    numberOfParts > 1 &&
    options &&
    options.currency === 'JPY' &&
    options.currencyDisplay === 'symbol'
  ) {
    result[numberOfParts - 1].value = '¥';
  }
  return result;
}
