import { emptyStringWhenNumberNan } from './utils/emptyStringWhenNumberNan.js';
import { getDecimalSeparator } from './getDecimalSeparator.js';
import { getGroupSeparator } from './getGroupSeparator.js';
import { getLocale } from '../utils/getLocale.js';
import { normalizeIntl } from './utils/normalize-format-number-to-parts/normalizeIntl.js';
import { normalSpaces } from './utils/normalSpaces.js';

/**
 * Round the number based on the options
 *
 * @param {number} number
 * @param {string} roundMode
 * @throws {Error} roundMode can only be round|floor|ceiling
 * @returns {number}
 */
export function roundNumber(number, roundMode) {
  switch (roundMode) {
    case 'floor':
      return Math.floor(number);
    case 'ceiling':
      return Math.ceil(number);
    case 'round':
      return Math.round(number);
    default:
      throw new Error('roundMode can only be round|floor|ceiling');
  }
}

/**
 * Splits a number up in parts for integer, fraction, group, literal, decimal and currency.
 *
 * @typedef {import('../../types/LocalizeMixinTypes').FormatNumberPart} FormatNumberPart
 * @param {number} number Number to split up
 * @param {import('../../types/LocalizeMixinTypes').FormatNumberOptions} [options] Intl options are available extended by roundMode,returnIfNaN
 * @returns {string | FormatNumberPart[]} Array with parts or (an empty string or returnIfNaN if not a number)
 */
export function formatNumberToParts(number, options = {}) {
  let parsedNumber = typeof number === 'string' ? parseFloat(number) : number;
  const computedLocale = getLocale(options && options.locale);
  // when parsedNumber is not a number we should return an empty string or returnIfNaN
  if (Number.isNaN(parsedNumber)) {
    return emptyStringWhenNumberNan(options && options.returnIfNaN);
  }
  // If roundMode is given the number is rounded based upon the mode
  if (options && options.roundMode) {
    parsedNumber = roundNumber(number, options.roundMode);
  }
  let formattedParts = [];

  const formattedNumber = Intl.NumberFormat(computedLocale, options).format(parsedNumber);
  const regexCurrency = /[.,\s0-9]/;
  const regexMinusSign = /[-]/; // U+002D, Hyphen-Minus, &#45;
  const regexNum = /[0-9]/;
  const regexSeparator = /[.,]/;
  const regexSpace = /[\s]/;
  let currency = '';
  let numberPart = '';
  let fraction = false;
  for (let i = 0; i < formattedNumber.length; i += 1) {
    // detect minusSign
    if (regexMinusSign.test(formattedNumber[i])) {
      formattedParts.push({ type: 'minusSign', value: '−' /* U+2212, 'Minus-Sign', &minus; */ });
    }
    // detect numbers
    if (regexNum.test(formattedNumber[i])) {
      numberPart += formattedNumber[i];
    }

    // detect currency (symbol or code)
    if (!regexCurrency.test(formattedNumber[i]) && !regexMinusSign.test(formattedNumber[i])) {
      currency += formattedNumber[i];
    }
    // push when another character then currency
    if (regexCurrency.test(formattedNumber[i]) && currency) {
      formattedParts.push({ type: 'currency', value: currency });
      currency = '';
    }

    // detect dot and comma separators
    if (regexSeparator.test(formattedNumber[i])) {
      // Write number grouping
      if (numberPart) {
        formattedParts.push({ type: 'integer', value: numberPart });
        numberPart = '';
      }
      const decimal = getDecimalSeparator(computedLocale, options);
      if (formattedNumber[i] === decimal || options.decimalSeparator === decimal) {
        formattedParts.push({ type: 'decimal', value: decimal });
        fraction = true;
      } else {
        formattedParts.push({ type: 'group', value: formattedNumber[i] });
      }
    }
    // detect literals (empty spaces) or space group separator
    if (regexSpace.test(formattedNumber[i])) {
      const group = getGroupSeparator(computedLocale);
      const hasNumberPart = !!numberPart;
      // Write number grouping
      if (numberPart && !fraction) {
        formattedParts.push({ type: 'integer', value: numberPart });
        numberPart = '';
      } else if (numberPart) {
        formattedParts.push({ type: 'fraction', value: numberPart });
        numberPart = '';
      }
      // If space equals the group separator it gets type group
      if (normalSpaces(formattedNumber[i]) === group && hasNumberPart && !fraction) {
        formattedParts.push({ type: 'group', value: formattedNumber[i] });
      } else {
        formattedParts.push({ type: 'literal', value: formattedNumber[i] });
      }
    }
    // Numbers after the decimal sign are fractions, write the last
    // fractions at the end of the number
    if (fraction === true && i === formattedNumber.length - 1) {
      // write last number part
      if (numberPart) {
        formattedParts.push({ type: 'fraction', value: numberPart });
      }
      // If there are no fractions but we reached the end write the number part as integer
    } else if (i === formattedNumber.length - 1 && numberPart) {
      formattedParts.push({ type: 'integer', value: numberPart });
    }
    // push currency on end of loop
    if (i === formattedNumber.length - 1 && currency) {
      formattedParts.push({ type: 'currency', value: currency });
      currency = '';
    }
  }
  formattedParts = normalizeIntl(formattedParts, options, computedLocale);
  return formattedParts;
}
