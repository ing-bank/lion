export function forceENAUSymbols(formattedParts, options) {
  const result = formattedParts;
  const numberOfParts = result.length;
  // Change the symbols for locale 'en-AU', due to bug in Chrome
  if (numberOfParts > 1 && options && options.currencyDisplay === 'symbol') {
    switch (options.currency) {
      case 'EUR':
        result[0].value = '€';
        break;
      case 'USD':
        result[0].value = '$';
        break;
      case 'JPY':
        result[0].value = '¥';
        break;
      /* no default */
    }
    result[1].value = '';
  }
  return result;
}
