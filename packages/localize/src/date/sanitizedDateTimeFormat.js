import { formatDate } from './formatDate.js';
import { clean } from './clean.js';

/**
 * To sanitize a date from IE11 handling
 *
 * @param date
 * @returns {string|XML}
 */
export function sanitizedDateTimeFormat(date, options) {
  const fDate = formatDate(date, options);
  return clean(fDate);
}
