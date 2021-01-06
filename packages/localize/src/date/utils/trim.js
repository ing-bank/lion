/**
 * To trim the date
 *
 * @param {string} dateAsString
 * @returns {string}
 */
export function trim(dateAsString) {
  return dateAsString.replace(/^[^\d]*/g, '').replace(/[^\d]*$/g, '');
}
