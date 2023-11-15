export const defaultMonthLabels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * @param {import('../../types/day.js').Day} day
 * @param {string[]} weekdays
 * @param {string[] } monthsLabels
 */
export function getDayMonthYear(day, weekdays, monthsLabels = defaultMonthLabels) {
  const dayNumber = day.date.getDate();
  const monthName = monthsLabels[day.date.getMonth()];
  const year = day.date.getFullYear();
  const weekdayName = day.weekOrder ? weekdays[day.weekOrder] : weekdays[0];

  return { dayNumber, monthName, year, weekdayName };
}
