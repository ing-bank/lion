import { normalizeDate } from './normalizeDate.js';

const monthsLocaleCache = {};

export function getMonthNames({ locale }) {
  let months = monthsLocaleCache[locale];

  if (months) {
    return months;
  }

  months = [];

  const formatter = new Intl.DateTimeFormat(locale, { month: 'long' });
  for (let i = 0; i < 12; i += 1) {
    const date = new Date(2019, i, 1);
    const formattedDate = formatter.format(date);
    const normalizedDate = normalizeDate(formattedDate);
    months.push(normalizedDate);
  }

  monthsLocaleCache[locale] = months;

  return months;
}
