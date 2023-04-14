import { getLocalizeManager } from '../getLocalizeManager.js';
import { formatNumberToParts } from './formatNumberToParts.js';
import { forceCurrencyNameForPHPEnGB } from './utils/normalize-get-currency-name/forceCurrencyNameForPHPEnGB.js';

/**
 * Based on number, returns currency name like 'US dollar'
 *
 * @typedef {import('../../types/LocalizeMixinTypes.js').FormatNumberPart} FormatNumberPart
 * @param {string} currencyIso iso code like USD
 * @param {import('../../types/LocalizeMixinTypes.js').FormatNumberOptions} [options] Intl options are available extended by roundMode
 * @returns {string} currency name like 'US dollar'
 */
export function getCurrencyName(currencyIso, options) {
  const localizeManager = getLocalizeManager();
  const parts = /** @type {FormatNumberPart[]} */ (
    formatNumberToParts(1, {
      ...options,
      style: 'currency',
      currency: currencyIso,
      currencyDisplay: 'name',
    })
  );
  let currencyName = parts
    .filter(p => p.type === 'currency')
    .map(o => o.value)
    .join(' ');
  const locale = options?.locale || localizeManager.locale;
  if (currencyIso === 'PHP' && locale === 'en-GB') {
    currencyName = forceCurrencyNameForPHPEnGB(currencyName);
  }
  return currencyName;
}
