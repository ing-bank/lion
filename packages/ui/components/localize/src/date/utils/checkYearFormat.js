/**
 *
 * @param {string} year
 * @returns {boolean}
 */
export function isCorrectYearFormat(year) {
  return /^\d{2}(\d{2})?$/g.test(year);
}
