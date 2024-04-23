import { formatDate } from '../formatDate.js';
import { clean } from './clean.js';

/**
 * To sanitize a date from IE11 handling
 *
 * @param {Date} date
 * @param {import('../../../types/LocalizeMixinTypes.js').FormatDateOptions} [options] Intl options are available
 * @returns {string}
 */
export function sanitizedDateTimeFormat(date, options) {
  const fDate = formatDate(date, options);
  return clean(fDate);
}
