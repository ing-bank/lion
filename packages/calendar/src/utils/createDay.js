/**
 * @param {Date} date,
 * @returns {import('../../types/day').Day} day
 */
export function createDay(
  date = new Date(),
  {
    weekOrder = 0,
    central = false,
    startOfWeek = false,
    selected = false,
    previousMonth = false,
    currentMonth = false,
    nextMonth = false,
    past = false,
    today = false,
    future = false,
    disabled = false,
  } = {},
) {
  return {
    weekOrder,
    central,
    date,
    startOfWeek,
    selected,
    previousMonth,
    currentMonth,
    nextMonth,
    past,
    today,
    future,
    disabled,
    tabindex: '-1',
    ariaPressed: 'false',
    ariaCurrent: undefined,
  };
}
