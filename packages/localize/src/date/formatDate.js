import { getLocale } from './getLocale.js';
import { normalizeIntlDate } from './normalizeIntlDate.js';

/**
 * Formats date based on locale and options
 *
 * @param {Date | any} date
 * @param {Object} options Intl options are available
 * @param {string} [options.locale]
 * @param {string} [options.localeMatcher]
 * @param {string} [options.formatMatcher]
 * @param {boolean}[options.hour12]
 * @param {string} [options.numberingSystem]
 * @param {string} [options.calendar]
 * @param {string} [options.timeZone]
 * @param {string} [options.timeZoneName]
 * @param {string} [options.weekday]
 * @param {string} [options.era]
 * @param {string} [options.year]
 * @param {string} [options.month]
 * @param {string} [options.day]
 * @param {string} [options.hour]
 * @param {string} [options.minute]
 * @param {string} [options.second]
 * @returns {string}
 */
export function formatDate(date, options) {
  if (!(date instanceof Date)) {
    return '';
  }
  /** @type {options} */
  const formatOptions = options || {};
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
