import { normalizeIntlDate } from './utils/normalizeIntlDate.js';
import { forceShortMonthNamesForEnGb } from './utils/forceShortMonthNamesForEnGb.js';

/** @type {Object.<string, Object.<string,string[]>>} */
const monthsLocaleCache = {};

/**
 * @desc Returns month names for locale
 * @param {Object} options
 * @param {string} [options.locale] locale
 * @param {"long" | "numeric" | "2-digit" | "short" | "narrow"} [options.style=long] long, short or narrow
 * @returns {string[]} like: ['January', 'February', ...etc].
 */
export function getMonthNames({ locale = 'en-GB', style = 'long' } = {}) {
  let months = monthsLocaleCache[locale] && monthsLocaleCache[locale][style];

  if (months) {
    return months;
  }

  months = [];

  const formatter = new Intl.DateTimeFormat(locale, { month: style });
  for (let i = 0; i < 12; i += 1) {
    const date = new Date(2019, i, 1);
    const formattedDate = formatter.format(date);
    const normalizedDate = normalizeIntlDate(formattedDate);
    months.push(normalizedDate);
  }
  if (locale === 'en-GB' && style === 'short') {
    months = forceShortMonthNamesForEnGb(months);
  }
  monthsLocaleCache[locale] = monthsLocaleCache[locale] || {};
  monthsLocaleCache[locale][style] = months;

  return months;
}
