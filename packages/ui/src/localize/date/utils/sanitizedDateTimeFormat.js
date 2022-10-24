import { formatDate } from '../formatDate.js';
import { clean } from './clean.js';

/**
 * To sanitize a date from IE11 handling
 *
 * @param {Date} date
 * @returns {string}
 */
export function sanitizedDateTimeFormat(date) {
  const fDate = formatDate(date);
  return clean(fDate);
}
