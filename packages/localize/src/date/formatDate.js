import { getLocale } from './getLocale.js';
import { normalizeIntlDate } from './normalizeIntlDate.js';

/**
 * Formats date based on locale and options
 *
 * @param date
 * @param options
 * @returns {*}
 */
export function formatDate(date, options) {
  if (!(date instanceof Date)) {
    return '';
  }
  const formatOptions = options || {};
  // make sure months and days are always 2-digits
  if (!options) {
    formatOptions.year = 'numeric';
    formatOptions.month = '2-digit';
    formatOptions.day = '2-digit';
  }
  if (options && !(options && options.year)) {
    formatOptions.year = 'numeric';
  }
  if (options && !(options && options.month)) {
    formatOptions.month = '2-digit';
  }
  if (options && !(options && options.day)) {
    formatOptions.day = '2-digit';
  }

  const computedLocale = getLocale(formatOptions && formatOptions.locale);
  let formattedDate = '';
  try {
    formattedDate = new Intl.DateTimeFormat(computedLocale, formatOptions).format(date);
  } catch (e) {
    formattedDate = '';
  }
  return normalizeIntlDate(formattedDate);
}
