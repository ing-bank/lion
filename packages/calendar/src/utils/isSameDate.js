/**
 * Compares if two days are the same
 *
 * @param {Date} day1
 * @param {Date} day2
 *
 * @returns {boolean}
 */
export function isSameDate(day1, day2) {
  return (
    day1 instanceof Date &&
    day2 instanceof Date &&
    day1.getDate() === day2.getDate() &&
    day1.getMonth() === day2.getMonth() &&
    day1.getFullYear() === day2.getFullYear()
  );
}
