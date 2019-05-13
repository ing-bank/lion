import { createMonth } from './createMonth.js';

export function createMultipleMonth(
  date,
  { firstDayOfWeek = 0, pastMonths = 0, futureMonths = 0 } = {},
) {
  const multipleMonths = {
    months: [],
  };

  for (let i = pastMonths; i > 0; i -= 1) {
    const pastDate = new Date(date);
    pastDate.setMonth(pastDate.getMonth() - i);
    multipleMonths.months.push(createMonth(pastDate, { firstDayOfWeek }));
  }

  multipleMonths.months.push(createMonth(date, { firstDayOfWeek }));

  for (let i = 0; i < futureMonths; i += 1) {
    const futureDate = new Date(date);
    futureDate.setMonth(futureDate.getMonth() + (i + 1));
    multipleMonths.months.push(createMonth(futureDate, { firstDayOfWeek }));
  }

  return multipleMonths;
}
