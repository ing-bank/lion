export function createDay(
  date = new Date(),
  {
    weekOrder,
    central = false,
    startOfWeek = false,
    selected = false,
    previousMonth = false,
    currentMonth = false,
    nextMonth = false,
    past = false,
    today = false,
    future = false,
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
  };
}
