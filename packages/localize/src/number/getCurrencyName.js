import { formatNumberToParts } from './formatNumberToParts.js';
import { localize } from '../localize.js';
import { forceCurrencyNameForPHPEnGB } from './utils/normalize-get-currency-name/forceCurrencyNameForPHPEnGB.js';

/**
 * Based on number, returns currency name like 'US dollar'
 *
 * @typedef {import('../../types/LocalizeMixinTypes').FormatNumberPart} FormatNumberPart
 * @param {string} currencyIso iso code like USD
 * @param {import('../../types/LocalizeMixinTypes').FormatNumberOptions} [options] Intl options are available extended by roundMode
 * @returns {string} currency name like 'US dollar'
 */
export function getCurrencyName(currencyIso, options) {
  const parts = /** @type {FormatNumberPart[]} */ (formatNumberToParts(1, {
    ...options,
    style: 'currency',
    currency: currencyIso,
    currencyDisplay: 'name',
  }));
  let currencyName = parts
    .filter(p => p.type === 'currency')
    .map(o => o.value)
    .join(' ');
  const locale = options?.locale || localize.locale;
  if (currencyIso === 'PHP' && locale === 'en-GB') {
    currencyName = forceCurrencyNameForPHPEnGB(currencyName);
  }
  return currencyName;
}
