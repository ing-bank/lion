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
 * Round the number based on the options
 *
 * @param {number} number
 * @param {string} roundMode
 * @returns {*}
 */
function roundNumber(number, roundMode) {
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
 * @param {Array} value
 * @return {Array} value with forced "normal" space
 */
export function normalSpaces(value) {
  // If non-breaking space (160) or narrow non-breaking space (8239) then return ' '
  return value.charCodeAt(0) === 160 || value.charCodeAt(0) === 8239 ? ' ' : value;
}

/**
 * To get the group separator
 *
 * @param {string} locale To override the browser locale
 * @returns {Object} the separator
 */
export function getGroupSeparator(locale) {
  const computedLocale = getLocale(locale);
  const formattedNumber = Intl.NumberFormat(computedLocale, {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format('1000');
  return normalSpaces(formattedNumber[1]);
}

/**
 * To get the decimal separator
 *
 * @param {string} locale To override the browser locale
 * @returns {Object} the separator
 */
export function getDecimalSeparator(locale) {
  const computedLocale = getLocale(locale);
  const formattedNumber = Intl.NumberFormat(computedLocale, {
    style: 'decimal',
    minimumFractionDigits: 1,
  }).format('1');
  return formattedNumber[1];
}

/**
 * When number is NaN we should return an empty string or returnIfNaN param
 *
 * @param {string} returnIfNaN
 * @returns {*}
 */
function emptyStringWhenNumberNan(returnIfNaN) {
  const stringToReturn = returnIfNaN || localize.formatNumberOptions.returnIfNaN;
  return stringToReturn;
}

/**
 * For Dutch and Belgian amounts the currency should be at the end of the string
 *
 * @param {Array} formattedParts
 * @returns {Array}
 */
function forceCurrencyToEnd(formattedParts) {
  if (formattedParts[0].type === 'currency') {
    const moveCur = formattedParts.splice(0, 1);
    const moveLit = formattedParts.splice(0, 1);
    formattedParts.push(moveLit[0]);
    formattedParts.push(moveCur[0]);
  } else if (formattedParts[0].type === 'minusSign' && formattedParts[1].type === 'currency') {
    const moveCur = formattedParts.splice(1, 1);
    const moveLit = formattedParts.splice(1, 1);
    formattedParts.push(moveLit[0]);
    formattedParts.push(moveCur[0]);
  }
  return formattedParts;
}

/**
 * When in some locales there is no space between currency and amount it is added
 *
 * @param {Array} formattedParts
 * @param {Object} options
 * @returns {*}
 */
function forceSpaceBetweenCurrencyCodeAndNumber(formattedParts, options) {
  const numberOfParts = formattedParts.length;
  const literalObject = { type: 'literal', value: ' ' };
  if (numberOfParts > 1 && options && options.currency && options.currencyDisplay === 'code') {
    if (formattedParts[0].type === 'currency' && formattedParts[1].type !== 'literal') {
      // currency in front of a number: EUR 1.00
      formattedParts.splice(1, 0, literalObject);
    } else if (
      formattedParts[0].type === 'minusSign' &&
      formattedParts[1].type === 'currency' &&
      formattedParts[2].type !== 'literal'
    ) {
      // currency in front of a negative number: -EUR 1.00
      formattedParts.splice(2, 0, literalObject);
    } else if (
      formattedParts[numberOfParts - 1].type === 'currency' &&
      formattedParts[numberOfParts - 2].type !== 'literal'
    ) {
      // currency in behind a number: 1.00 EUR || -1.00 EUR
      formattedParts.splice(numberOfParts - 1, 0, literalObject);
    }
  }
  return formattedParts;
}

/**
 * Add separators when they are not present
 *
 * @param {Array} formattedParts
 * @param {string} groupSeparator
 * @returns {Array}
 */
function forceAddGroupSeparators(formattedParts, groupSeparator) {
  let concatArray = [];
  if (formattedParts[0].type === 'integer') {
    const getInteger = formattedParts.splice(0, 1);
    const numberOfDigits = getInteger[0].value.length;
    const mod3 = numberOfDigits % 3;
    const groups = Math.floor(numberOfDigits / 3);
    const numberArray = [];
    let numberOfGroups = 0;
    let numberPart = '';
    let firstGroup = false;
    // Loop through the  integer
    for (let i = 0; i < numberOfDigits; i += 1) {
      numberPart += getInteger[0].value[i];
      // Create first grouping which is < 3
      if (numberPart.length === mod3 && firstGroup === false) {
        numberArray.push({ type: 'integer', value: numberPart });
        if (numberOfDigits > 3) {
          numberArray.push({ type: 'group', value: groupSeparator });
        }
        numberPart = '';
        firstGroup = true;
        // Create groupings of 3
      } else if (numberPart.length === 3 && i < numberOfDigits - 1) {
        numberOfGroups += 1;
        numberArray.push({ type: 'integer', value: numberPart });
        if (numberOfGroups !== groups) {
          numberArray.push({ type: 'group', value: groupSeparator });
        }
        numberPart = '';
      }
    }
    numberArray.push({ type: 'integer', value: numberPart });
    concatArray = numberArray.concat(formattedParts);
  }
  return concatArray;
}

/**
 * @param {Array} formattedParts
 * @return {Array} parts with forced "normal" spaces
 */
function forceNormalSpaces(formattedParts) {
  const result = [];
  formattedParts.forEach(part => {
    result.push({
      type: part.type,
      value: normalSpaces(part.value),
    });
  });
  return result;
}

function forceYenSymbol(formattedParts, options) {
  const result = formattedParts;
  const numberOfParts = result.length;
  // Change the symbol from JPY to ¥, due to bug in Chrome
  if (
    numberOfParts > 1 &&
    options &&
    options.currency === 'JPY' &&
    options.currencyDisplay === 'symbol'
  ) {
    result[numberOfParts - 1].value = '¥';
  }
  return result;
}

/**
 * Function with all fixes on localize
 *
 * @param {Array} formattedParts
 * @param {Object} options
 * @param {string} _locale
 * @returns {*}
 */
function normalizeIntl(formattedParts, options, _locale) {
  let normalize = forceNormalSpaces(formattedParts, options);
  // Dutch and Belgian currency must be moved to end of number
  if (options && options.style === 'currency') {
    if (_locale === 'nl-NL' || _locale.slice(-2) === 'BE') {
      normalize = forceCurrencyToEnd(normalize);
    }
    // Add group separator for Bulgarian locale
    if (_locale === 'bg-BG') {
      normalize = forceAddGroupSeparators(normalize, getGroupSeparator());
    }
    // Force space between currency code and number
    if (_locale === 'en-GB' || _locale === 'en-US' || _locale === 'en-AU') {
      normalize = forceSpaceBetweenCurrencyCodeAndNumber(normalize, options);
    }
    // Force missing Japanese Yen symbol
    if (_locale === 'fr-FR' || _locale === 'fr-BE') {
      normalize = forceYenSymbol(normalize, options);
    }
  }
  return normalize;
}

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
  const regexMinusSign = /[-]/;
  const regexNum = /[0-9]/;
  const regexSeparator = /[.,]/;
  const regexSpace = /[\s]/;
  let currencyCode = '';
  let numberPart = '';
  let fraction = false;
  for (let i = 0; i < formattedNumber.length; i += 1) {
    // detect minusSign
    if (regexMinusSign.test(formattedNumber[i])) {
      formattedParts.push({ type: 'minusSign', value: formattedNumber[i] });
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

/**
 * @example
 * getFractionDigits('JOD'); // return 3
 *
 * @param {string} currency Currency code e.g. EUR
 * @return {number} fraction for the given currency
 */
export function getFractionDigits(currency = 'EUR') {
  const parts = formatNumberToParts(123, {
    style: 'currency',
    currency,
  });
  const [fractionPart] = parts.filter(part => part.type === 'fraction');
  return fractionPart ? fractionPart.value.length : 0;
}

/**
 * Formats a number based on locale and options. It uses Intl for the formatting.
 *
 * @param {number} number Number to be formatted
 * @param {Object} options Intl options are available extended by roundMode
 * @returns {*} Formatted number
 */
export function formatNumber(number, options) {
  if (number === undefined || number === null) return '';
  const formattedToParts = formatNumberToParts(number, options);
  // If number is not a number
  if (
    formattedToParts === (options && options.returnIfNaN) ||
    formattedToParts === localize.formatNumberOptions.returnIfNaN
  ) {
    return formattedToParts;
  }
  let printNumberOfParts = '';
  // update numberOfParts because there may be some parts added
  const numberOfParts = formattedToParts && formattedToParts.length;
  for (let i = 0; i < numberOfParts; i += 1) {
    printNumberOfParts += formattedToParts[i].value;
  }
  return printNumberOfParts;
}
