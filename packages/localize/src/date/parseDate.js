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
  let isFullYear = false;
  switch (memoizedGetDateFormatBasedOnLocale()) {
    case 'day-month-year':
      isFullYear = stringToParse.length === 10;
      parsedString = [
        stringToParse.slice(6, 10),
        stringToParse.slice(3, 5),
        stringToParse.slice(0, 2),
      ].join('/');
      break;
    case 'month-day-year':
      isFullYear = stringToParse.length === 10;
      parsedString = [
        stringToParse.slice(6, 10),
        stringToParse.slice(0, 2),
        stringToParse.slice(3, 5),
      ].join('/');
      break;
    case 'year-month-day':
      isFullYear = /\d+/.test(stringToParse.slice(0, 4));
      parsedString = [
        stringToParse.slice(0, 4),
        stringToParse.slice(5, 7),
        stringToParse.slice(8, 10),
      ].join('/');
      break;
    default:
      parsedString = '0000/00/00';
  }

  const parsedDate = new Date(parsedString);
  // Check if parsedDate is not `Invalid Date`
  // eslint-disable-next-line no-restricted-globals
  if (!isNaN(parsedDate) && isFullYear) {
    return parsedDate;
  }
  return undefined;
}
