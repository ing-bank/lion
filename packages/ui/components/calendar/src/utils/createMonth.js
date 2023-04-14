import { createWeek } from './createWeek.js';

/**
 *
 * @param {Date} date
 * @param {Object} opts
 * @param {number} [opts.firstDayOfWeek]
 * @returns {import('../../types/day.js').Month}
 */
export function createMonth(date, { firstDayOfWeek = 0 } = {}) {
  if (Object.prototype.toString.call(date) !== '[object Date]') {
    throw new Error('invalid date provided');
  }
  const firstDayOfMonth = new Date(date);
  firstDayOfMonth.setDate(1);
  const monthNumber = firstDayOfMonth.getMonth();
  const weekOptions = { firstDayOfWeek };

  const month = {
    /** @type {{days: import('../../types/day.js').Day[]}[]} */
    weeks: [],
  };

  let nextWeek = createWeek(firstDayOfMonth, weekOptions);
  do {
    month.weeks.push(nextWeek);
    const firstDayOfNextWeek = new Date(nextWeek.days[6].date); // last day of current week
    firstDayOfNextWeek.setDate(firstDayOfNextWeek.getDate() + 1); // make it first day of next week
    nextWeek = createWeek(firstDayOfNextWeek, weekOptions);
  } while (nextWeek.days[0].date.getMonth() === monthNumber);

  return month;
}
