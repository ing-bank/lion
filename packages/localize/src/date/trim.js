/**
 * To trim the date
 *
 * @param dateAsString
 * @returns {string|XML}
 */
export function trim(dateAsString) {
  return dateAsString.replace(/^[^\d]*/g, '').replace(/[^\d]*$/g, '');
}
