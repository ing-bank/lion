import { formatNumberToParts } from './formatNumberToParts.js';

/**
 * Based on number, returns currency name like 'US dollar'
 *
 * @param {string} currencyIso iso code like USD
 * @param {Object} options Intl options are available extended by roundMode
 * @returns {string} currency name like 'US dollar'
 */
export function getCurrencyName(currencyIso, options) {
  const parts = formatNumberToParts(1, {
    ...options,
    style: 'currency',
    currency: currencyIso,
    currencyDisplay: 'name',
  });
  const currencyName = parts
    .filter(p => p.type === 'currency')
    .map(o => o.value)
    .join(' ');
  return currencyName;
}
