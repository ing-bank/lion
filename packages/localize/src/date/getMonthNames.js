import { normalizeIntlDate } from './normalizeIntlDate.js';

/**
 * @typedef {import('../../types/localizeTypes').StringToStringArrayMap} StringToStringArrayMap
 */

/** @type {Object.<string, StringToStringArrayMap>} */
const monthsLocaleCache = {};

/**
 * @desc Returns month names for locale
 * @param {Object} [options]
 * @param {string} [options.locale] locale
 * @param {string} [options.style=long] long, short or narrow
 * @returns {string[]} like: ['January', 'February', ...etc].
 */
export function getMonthNames({ locale, style = 'long' } = {}) {
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

  monthsLocaleCache[locale] = monthsLocaleCache[locale] || {};
  monthsLocaleCache[locale][style] = months;

  return months;
}
