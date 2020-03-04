/**
 * Function that fixes currency label with locale options
 *
 * @param {String} currency
 * @param {string} locale
 * @returns {string} currency
 */
export function normalizeCurrencyLabel(currency, locale) {
  if (currency === 'TRY' && locale === 'tr-TR') {
    return 'TL';
  }
  return currency;
}
