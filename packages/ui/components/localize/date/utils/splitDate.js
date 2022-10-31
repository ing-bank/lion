/**
 * To split a date into days, months, years, etc
 *
 * @param {string} dateAsString
 * @returns {ArrayLike.<string> | null}
 */
export function splitDate(dateAsString) {
  return dateAsString.match(/(\d{1,4})([^\d]+)(\d{1,4})([^\d]+)(\d{1,4})/);
}
