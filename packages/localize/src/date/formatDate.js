import { localize } from '../localize.js';
import { getLocale } from './getLocale.js';
import { normalizeIntlDate } from './normalizeIntlDate.js';

/** @typedef {import('../../types/LocalizeMixinTypes').DatePostProcessor} DatePostProcessor */

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

  if (localize.formatDateOptions.postProcessors.size > 0) {
    Array.from(localize.formatDateOptions.postProcessors).forEach(([locale, fn]) => {
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
