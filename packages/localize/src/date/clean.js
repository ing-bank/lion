import { trim } from './trim.js';

/**
 * To clean date from added characters from IE
 *
 * @param dateAsString
 * @returns {string|XML}
 */
export function clean(dateAsString) {
  // list of separators is from wikipedia https://www.wikiwand.com/en/Date_format_by_country
  // slash, point, dash or space
  return trim(dateAsString.replace(/[^\d-. /]/g, ''));
}
