export function forceENAUSymbols(formattedParts, options) {
  const result = formattedParts;
  const numberOfParts = result.length;
  // Change the symbol from JPY to ¥, due to bug in Chrome
  if (numberOfParts > 1 && options && options.currencyDisplay === 'symbol') {
    if (options.currency === 'EUR') {
      result[0].value = '€';
      result[1].value = '';
    } else if (options.currency === 'USD') {
      result[0].value = '$';
      result[1].value = '';
    } else if (options.currency === 'JPY') {
      result[0].value = '¥';
      result[1].value = '';
    }
  }
  return result;
}
