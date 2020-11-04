/**
 * @desc Makes suitable for date comparisons
 * @param {Date} date
 * @returns {Date}
 */
export function normalizeDateTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
