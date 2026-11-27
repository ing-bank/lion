import { getLocale } from '../utils/getLocale.js';
import { getLocalizeManager } from '../getLocalizeManager.js';
import { normalizeIntlDate } from './utils/normalizeIntlDate.js';

/** @typedef {import('../../types/LocalizeMixinTypes.js').DatePostProcessor} DatePostProcessor */

/**
 * Formats date based on locale and options
 *
 * @param {Date | string} date A Date or an ISO calendar date (YYYY-MM-DD)
 * @param {import('../../types/LocalizeMixinTypes.js').FormatDateOptions} [options] Intl options are available
 * @returns {string}
 */
export function formatDate(date, options) {
  const localizeManager = getLocalizeManager();
  const isCalendarDate = typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date);
  const dateToFormat = isCalendarDate ? new Date(date) : date;
  if (
    !(dateToFormat instanceof Date) ||
    (isCalendarDate &&
      (Number.isNaN(dateToFormat.getTime()) || dateToFormat.toISOString().slice(0, 10) !== date))
  ) {
    return '';
  }

  const formatOptions =
    (isCalendarDate ? { ...options, timeZone: options?.timeZone ?? 'UTC' } : options) ||
    /** @type {import('../../types/LocalizeMixinTypes.js').FormatDateOptions} */ ({});
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
    formattedDate = new Intl.DateTimeFormat(computedLocale, formatOptions).format(dateToFormat);
  } catch (e) {
    formattedDate = '';
  }

  if (localizeManager.formatDateOptions.postProcessors.size > 0) {
    Array.from(localizeManager.formatDateOptions.postProcessors).forEach(([locale, fn]) => {
      if (locale === computedLocale) {
        formattedDate = fn(formattedDate);
      }
    });
  }

  if (formatOptions.postProcessors && formatOptions.postProcessors.size > 0) {
    Array.from(formatOptions.postProcessors).forEach(([locale, fn]) => {
      if (locale === computedLocale) {
        formattedDate = fn(formattedDate);
      }
    });
  }

  return normalizeIntlDate(formattedDate, computedLocale, formatOptions);
}
