import { emptyStringWhenNumberNan } from './emptyStringWhenNumberNan.js';
import { getDecimalSeparator } from './getDecimalSeparator.js';
import { getGroupSeparator } from './getGroupSeparator.js';
import { getLocale } from './getLocale.js';
import { normalizeIntl } from './normalizeIntl.js';
import { normalSpaces } from './normalSpaces.js';
import { roundNumber } from './roundNumber.js';

/**
 * Splits a number up in parts for integer, fraction, group, literal, decimal and currency.
 *
 * @param {number} number Number to split up
 * @param {Object} options Intl options are available extended by roundMode
 * @returns {Array} Array with parts
 */
export function formatNumberToParts(number, options) {
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
  const regexSymbol = /[A-Z.,\s0-9]/;
  const regexCode = /[A-Z]/;

  /**
   * TODO: Preprocessor should convert other "dashes" unicodes to &minus;
   * Then our regex should test for &minus;
   * See also https://www.deque.com/blog/dont-screen-readers-read-whats-screen-part-1-punctuation-typographic-symbols/
   */
  const regexMinusSign = /[-]/; // U+002D, Hyphen-Minus, &#45;  is what we test on for now, since most keyboards give you this for dash

  const regexNum = /[0-9]/;
  const regexSeparator = /[.,]/;
  const regexSpace = /[\s]/;
  let currencyCode = '';
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
    // detect currency symbol
    if (!regexSymbol.test(formattedNumber[i]) && !regexMinusSign.test(formattedNumber[i])) {
      // Write number grouping
      if (numberPart && !fraction) {
        formattedParts.push({ type: 'integer', value: numberPart });
        numberPart = '';
      } else if (numberPart) {
        formattedParts.push({ type: 'fraction', value: numberPart });
        numberPart = '';
      }
      formattedParts.push({ type: 'currency', value: formattedNumber[i] });
    }
    // detect currency code
    if (regexCode.test(formattedNumber[i])) {
      currencyCode += formattedNumber[i];
      // Write number grouping
      if (numberPart && !fraction) {
        formattedParts.push({ type: 'integer', value: numberPart });
        numberPart = '';
      } else if (numberPart) {
        formattedParts.push({ type: 'fraction', value: numberPart });
        numberPart = '';
      }
      if (currencyCode.length === 3) {
        formattedParts.push({ type: 'currency', value: currencyCode });
        currencyCode = '';
      }
    }
    // detect dot and comma separators
    if (regexSeparator.test(formattedNumber[i])) {
      // Write number grouping
      if (numberPart) {
        formattedParts.push({ type: 'integer', value: numberPart });
        numberPart = '';
      }
      const decimal = getDecimalSeparator();
      if (formattedNumber[i] === decimal) {
        formattedParts.push({ type: 'decimal', value: formattedNumber[i] });
        fraction = true;
      } else {
        formattedParts.push({ type: 'group', value: formattedNumber[i] });
      }
    }
    // detect literals (empty spaces) or space group separator
    if (regexSpace.test(formattedNumber[i])) {
      const group = getGroupSeparator();
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
      // If there are no fractions but we reached the end write the numberpart as integer
    } else if (i === formattedNumber.length - 1 && numberPart) {
      formattedParts.push({ type: 'integer', value: numberPart });
    }
  }
  formattedParts = normalizeIntl(formattedParts, options, computedLocale);
  return formattedParts;
}
