/** @type {Object.<string, string>} */
const CURRENCY_CODE_SYMBOL_MAP = {
  EUR: '€',
  USD: '$',
  JPY: '¥',
};

/**
 * Change the symbols for locale 'en-AU', due to bug in Chrome
 *
 * @param {{type: string, value: string}[]} formattedParts
 * @param {Object} [options]
 * @param {string} [options.currency]
 * @param {string} [options.currencyDisplay]
 * @returns {{type: string, value: string}[]}
 */
export function forceENAUSymbols(formattedParts, { currency, currencyDisplay } = {}) {
  const result = formattedParts;
  if (formattedParts.length > 1 && currencyDisplay === 'symbol') {
    if (Object.keys(CURRENCY_CODE_SYMBOL_MAP).includes(currency)) {
      result[0].value = CURRENCY_CODE_SYMBOL_MAP[currency];
    }
    result[1].value = '';
  }
  return result;
}
