import { localize } from '../localize.js';
import { getDateFormatBasedOnLocale } from './getDateFormatBasedOnLocale.js';
import { addLeadingZero } from './addLeadingZero.js';
import { parseISOString, isoFormatDMY } from './isoUTCConverter.js';

const memoize = fn => {
  const cache = {};
  return parm => {
    const n = parm;
    if (n in cache) {
      return cache[n];
    }
    const result = fn(n);
    cache[n] = result;
    return result;
  };
};

const memoizedGetDateFormatBasedOnLocale = memoize(getDateFormatBasedOnLocale);

/**
 * To parse a date into the right format
 *
 * @param date
 * @returns {Date}
 */
export function parseDate(date) {
  const stringToParse = addLeadingZero(date);
  let parsedString;
  switch (memoizedGetDateFormatBasedOnLocale(localize.locale)) {
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
  /**
   * The reason behind converting date string to ISO 8601 format is , date string
   * with / separator does not trigger the ISO parse, insteaad it presumes that
   * the date is in current timezone not in UTC
   * */
  const parsedStringDate = new Date(parsedString).toISOString();

  const utcDate = parseISOString(parsedStringDate);

  const parsedDate = isoFormatDMY(utcDate);

  // Check if parsedDate is not `Invalid Date`
  // eslint-disable-next-line no-restricted-globals
  if (!isNaN(parsedDate)) {
    return parsedDate;
  }
  return undefined;
}
