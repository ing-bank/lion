import { getLocale } from './getLocale.js';
import { normalizeIntlDate } from './normalizeIntlDate.js';

/**
 * Formats date based on locale and options
 *
 * @param {Date} date
 * @param {import('@lion/localize/types/LocalizeMixinTypes').FormatDateOptions} [options] Intl options are available
 * @returns {string}
 */
export function formatDate(date, options) {
  if (!(date instanceof Date)) {
    return '';
  }

  const formatOptions =
    options ||
    /** @type {import('@lion/localize/types/LocalizeMixinTypes').FormatDateOptions} */ ({});
  /**
   * Set smart defaults if:
   * 1) no options object is passed
   * 2) options object is passed, but none of the following props on it: day, month, year.
   */
  if (!options || (options && !options.day && !options.month && !options.year)) {
    formatOptions.year = 'numeric';
    formatOptions.month = '2-digit';
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
