/**
 * For Turkey fixes currency label with locale options
 *
 * @param {string} currency
 * @param {string} locale
 * @returns {string}
 */
export function normalizeCurrencyLabel(currency, locale) {
  return currency === 'TRY' && locale === 'tr-TR' ? 'TL' : currency;
}
