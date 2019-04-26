import { localize } from './localize.js';

/**
 * Gets the locale to use
 *
 * @param {string} locale Locale to override browser locale
 * @returns {string}
 */
function getLocale(locale) {
  if (locale) {
    return locale;
  }
  if (localize && localize.locale) {
    return localize.locale;
  }
  return 'en-GB';
}

/**
 * To filter out some added characters in IE
 *
 * @param str
 * @returns {string}
 */
function normalizeDate(str) {
  const dateString = [];
  for (let i = 0, n = str.length; i < n; i += 1) {
    // remove unicode 160
    if (str.charCodeAt(i) === 160) {
      dateString.push(' ');
      // remove unicode 8206
    } else if (str.charCodeAt(i) === 8206) {
      dateString.push('');
    } else {
      dateString.push(str.charAt(i));
    }
  }

  return dateString.join('');
}

/**
 * Formats date based on locale and options
 *
 * @param date
 * @param options
 * @returns {*}
 */
export function formatDate(date, options) {
  if (!(date instanceof Date)) {
    return '0000-00-00';
  }
  const formatOptions = options || {};
  // make sure months and days are always 2-digits
  if (!options) {
    formatOptions.year = 'numeric';
    formatOptions.month = '2-digit';
    formatOptions.day = '2-digit';
  }
  if (options && !(options && options.year)) {
    formatOptions.year = 'numeric';
  }
  if (options && !(options && options.month)) {
    formatOptions.month = '2-digit';
  }
  if (options && !(options && options.day)) {
    formatOptions.day = '2-digit';
  }

  const computedLocale = getLocale(formatOptions && formatOptions.locale);
  let formattedDate = '';
  try {
    formattedDate = new Intl.DateTimeFormat(computedLocale, formatOptions).format(date);
  } catch (e) {
    formattedDate = '';
  }
  return normalizeDate(formattedDate);
}
/**
 * To trim the date
 *
 * @param dateAsString
 * @returns {string|XML}
 */
function trim(dateAsString) {
  return dateAsString.replace(/^[^\d]*/g, '').replace(/[^\d]*$/g, '');
}

/**
 * To clean date from added characters from IE
 *
 * @param dateAsString
 * @returns {string|XML}
 */
function clean(dateAsString) {
  // list of separators is from wikipedia https://www.wikiwand.com/en/Date_format_by_country
  // slash, point, dash or space
  return trim(dateAsString.replace(/[^\d-. /]/g, ''));
}

/**
 * To get the absolute value of a number.
 *
 * @param n
 * @returns {string}
 */
function pad(n) {
  const v = Math.abs(n);

  return String(v < 10 ? `0${v}` : v);
}

/**
 * To sanitize a date from IE11 handling
 *
 * @param date
 * @returns {string|XML}
 */
function sanitizedDateTimeFormat(date) {
  const fDate = formatDate(date);
  return clean(fDate);
}

/**
 * To split a date into days, months, years, etc
 *
 * @param date
 * @returns {Array|{index: number, input: string}|*}
 */
function splitDate(date) {
  return date.match(/(\d{1,4})([^\d]+)(\d{1,4})([^\d]+)(\d{1,4})/);
}

/**
 * To add a leading zero to a single number
 *
 * @param dateString
 * @returns {*}
 */
function addLeadingZero(dateString) {
  const dateParts = splitDate(dateString);
  const delimiter = dateParts ? dateParts[2] : '';
  const uniformDateString = dateString.replace(/[.\-/\s]/g, delimiter);
  const dateArray = uniformDateString.split && uniformDateString.split(delimiter);
  if (!dateArray || dateArray.length !== 3) {
    // prevent fail on invalid dates
    return '';
  }
  return dateArray.map(pad).join('-');
}

/**
 * To compute the localized date format
 *
 * @returns {string}
 */
export function getDateFormatBasedOnLocale() {
  function computePositions(dateParts) {
    function getPartByIndex(index) {
      return { 2012: 'year', 12: 'month', 20: 'day' }[dateParts[index]];
    }

    return [1, 3, 5].map(getPartByIndex);
  }

  // Arbitrary date with different values for year,month,day
  const date = new Date();
  date.setDate(20);
  date.setMonth(11);
  date.setFullYear(2012);

  // Strange characters added by IE11 need to be taken into account here
  const formattedDate = sanitizedDateTimeFormat(date);

  // For Dutch locale, dateParts would match: [ 1:'20', 2:'-', 3:'12', 4:'-', 5:'2012' ]
  const dateParts = splitDate(formattedDate);

  const dateFormat = {};
  dateFormat.positions = computePositions(dateParts);
  return `${dateFormat.positions[0]}-${dateFormat.positions[1]}-${dateFormat.positions[2]}`;
}

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
  // Check if parsedDate is not `Invalid Date`
  // eslint-disable-next-line no-restricted-globals
  if (!isNaN(parsedDate)) {
    return parsedDate;
  }
  return undefined;
}
