import { getDateFormatBasedOnLocale } from './getDateFormatBasedOnLocale.js';
import { getLocalizeManager } from '../getLocalizeManager.js';
import { addLeadingZero } from './utils/addLeadingZero.js';
import { isCorrectYearFormat } from './utils/checkYearFormat.js';

/**
 * @typedef {import('../../types/LocalizeMixinTypes.js').FormatDateOptions} FormatDateOptions
 */

/**
 * @param {function} fn
 */
const memoize = fn => {
  /** @type {Object.<any, any>} */
  const cache = {};

  return /** @param {any} parm */ parm => {
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
 * @param {string} dateString
 * @param {FormatDateOptions} [options] Intl options are available
 * @returns {Date | undefined}
 */
export function parseDate(dateString, options) {
  const localizeManager = getLocalizeManager();

  const stringToParse = addLeadingZero(dateString);
  let parsedString;

  switch (memoizedGetDateFormatBasedOnLocale(options?.locale || localizeManager.locale)) {
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

  const [year, month, day] = parsedString.split('/').map(Number);
  const [yearString] = parsedString.split('/');
  if (!isCorrectYearFormat(yearString)) {
    return undefined;
  }
  let correctedYear = year;
  if (year < 50) {
    correctedYear = 2000 + year;
  }

  const parsedDate = new Date(correctedYear, month - 1, day);
  // Check if parsedDate is not `Invalid Date` or that the date has changed (e.g. the not existing 31.02.2020)
  if (
    year > 0 &&
    month > 0 &&
    day > 0 &&
    parsedDate.getDate() === day &&
    parsedDate.getMonth() === month - 1
  ) {
    return parsedDate;
  }
  return undefined;
}
