/**
 * Gives the first day of the next month
 *
 * @param {Date} date
 *
 * returns {Date}
 */
export function getFirstDayNextMonth(date) {
  const result = new Date(date);
  result.setDate(1);
  result.setMonth(date.getMonth() + 1);
  return result;
}
