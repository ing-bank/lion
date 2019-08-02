import { localize } from '../localize.js';
import { getDateFormatBasedOnLocale } from './getDateFormatBasedOnLocale.js';
import { addLeadingZero } from './addLeadingZero.js';

const memoize = (fn, parm) => {
  const cache = {};
  return () => {
    const n = parm;
    if (n in cache) {
      return cache[n];
    }
    const result = fn(n);
    cache[n] = result;
    return result;
  };
};

const memoizedGetDateFormatBasedOnLocale = memoize(getDateFormatBasedOnLocale, localize.locale);

/**
 * To parse a date into the right format
 *
 * @param date
 * @returns {Date}
 */
export function parseDate(date) {
  const stringToParse = addLeadingZero(date);
  let parsedString;
  switch (memoizedGetDateFormatBasedOnLocale()) {
    case 'day-month-year':
      parsedString = `${stringToParse.slice(6, 10)}/${stringToParse.slice(
        3,
        5,
      )}/${stringToParse.slice(0, 2)}`;
      break;
    case 'month-day-year':
      parsedString = `${stringToParse.slice(6, 10)}/${stringToParse.slice(
        0,
        2,
      )}/${stringToParse.slice(3, 5)}`;
      break;
    case 'year-month-day':
      parsedString = `${stringToParse.slice(0, 4)}/${stringToParse.slice(
        5,
        7,
      )}/${stringToParse.slice(8, 10)}`;
      break;
    default:
      parsedString = '0000/00/00';
  }
  const parsedDate = new Date(parsedString);
  // Check if parsedDate is not `Invalid Date`.
  // `Invalid Date` is actually a Date object, so use isNaN to distinguish between invalid/valid.
  // Number.isNaN not available on IE11.
  // eslint-disable-next-line no-restricted-globals
  if (!isNaN(parsedDate)) {
    return parsedDate;
  }
  return undefined;
}
