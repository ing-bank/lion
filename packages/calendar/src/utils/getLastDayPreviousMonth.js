/**
 * Gives the last day of the previous month
 *
 * @param {Date} date
 *
 * @returns {Date}
 */
export function getLastDayPreviousMonth(date) {
  const previous = new Date(date);
  previous.setDate(0);
  return new Date(previous);
}
