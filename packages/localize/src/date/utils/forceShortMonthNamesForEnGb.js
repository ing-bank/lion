/**
 * @param {string[]} months
 */
export function forceShortMonthNamesForEnGb(months) {
  if (months[8] === 'Sept') {
    // eslint-disable-next-line no-param-reassign
    months[8] = 'Sep';
  }
  return months;
}
