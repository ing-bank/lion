/**
 * To split a date into days, months, years, etc
 *
 * @param date
 * @returns {Array|{index: number, input: string}|*}
 */
export function splitDate(date) {
  return date.match(/(\d{1,4})([^\d]+)(\d{1,4})([^\d]+)(\d{1,4})/);
}
