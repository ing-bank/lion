
/**
 * @desc Makes suitable for date comparisons
 * @param {Date} d
 * @returns {Date}
 */
export function normalizeDateTime(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
