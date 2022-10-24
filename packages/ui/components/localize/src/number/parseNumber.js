import { getDecimalSeparator } from './getDecimalSeparator.js';

/**
 * Determines the best possible parsing mode.
 *
 * It has 3 "methods" of returning numbers
 * - 'unparseable': becomes just numbers
 * - 'withLocale': result depends on given or global locale
 * - 'heuristic': result depends on considering separators
 *
 * @example
 * parseNumber('1.234.567'); // method: unparseable => 1234567
 * parseNumber('1.234'); // method: withLocale => depending on locale 1234 or 1.234
 * parseNumber('1.234,56'); // method: heuristic => 1234.56
 * parseNumber('1 234.56'); // method: heuristic => 1234.56
 * parseNumber('1,234.56'); // method: heuristic => 1234.56
 *
 * @param {string} value Clean number (only [0-9 ,.]) to be parsed
 * @param {object} options
 * @param {string?} [options.mode] auto|pasted
 * @return {string} unparseable|withLocale|heuristic
 */
function getParseMode(value, { mode = 'auto' } = {}) {
  const separators = value.match(/[., ]/g);

  if (!separators || (mode === 'auto' && separators.length === 1)) {
    return 'withLocale';
  }
  if (separators.length === 1 || separators[0] !== separators[separators.length - 1]) {
    return 'heuristic';
  }
  return 'unparseable';
}

/**
 * Parses numbers by considering the locale.
 * Useful for numbers with an ending pair of 3 number chars as in this case you can not be
 * certain if it is a group or comma separator. e.g. 1.234; 1,234; 1234.567;
 * Taking into consideration the locale we make the best possible assumption.
 *
 * @example
 * parseWithLocale('1.234', { locale: 'en-GB' }) => 1.234
 * parseWithLocale('1,234', { locale: 'en-GB' }) => 1234
 *
 * @param {string} value Number to be parsed
 * @param {import('../../types/LocalizeMixinTypes.js').FormatNumberOptions} options Locale Options
 */
function parseWithLocale(value, options) {
  const locale = options && options.locale ? options.locale : undefined;
  const separator = getDecimalSeparator(locale, options);
  const regexNumberAndLocaleSeparator = new RegExp(`[0-9${separator}-]`, 'g');
  let numberAndLocaleSeparator = value.match(regexNumberAndLocaleSeparator)?.join('');
  if (separator === ',') {
    numberAndLocaleSeparator = numberAndLocaleSeparator?.replace(',', '.');
  }
  if (!numberAndLocaleSeparator) {
    return NaN;
  }
  return parseFloat(numberAndLocaleSeparator);
}

/**
 * Parses numbers by considering all separators.
 * It only keeps the last separator and uses it as decimal separator.
 *
 * Warning: This function works only with numbers that can be heuristically parsed.
 *
 * @param {string} value Number that can be heuristically parsed
 * @return {number} parsed javascript number
 */
function parseHeuristic(value) {
  if (value.match(/[0-9., ]/g)) {
    // 1. put placeholder at decimal separator
    const numberString = value
      .replace(/(,|\.)([^,|.]*)$/g, '_decSep_$2')
      .replace(/(,|\.| )/g, '') // 2. remove all group separators
      .replace(/_decSep_/, '.'); // 3. restore decimal separator
    return parseFloat(numberString);
  }
  return 0;
}

/**
 * Parses a number string and returns the best possible javascript number.
 * For edge cases it may use locale to give the best possible assumption.
 *
 * It has 3 "methods" of returning numbers
 * - 'unparseable': becomes just numbers
 * - 'withLocale': result depends on given or global locale
 * - 'heuristic': result depends on considering separators
 *
 * @example
 * parseNumber('1.234.567'); // method: unparseable => 1234567
 * parseNumber('1.234'); // method: withLocale => depending on locale 1234 or 1.234
 * parseNumber('1.234,56'); // method: heuristic => 1234.56
 * parseNumber('1 234.56'); // method: heuristic => 1234.56
 * parseNumber('1,234.56'); // method: heuristic => 1234.56
 *
 * @param {string} value Number to be parsed
 * @param {import('../../types/LocalizeMixinTypes.js').FormatNumberOptions} [options] Locale Options
 */
export function parseNumber(value, options) {
  const containsNumbers = value.match(/\d/g);
  if (!containsNumbers) {
    return undefined;
  }
  const matchedInput = value.match(/[0-9,.\- ]/g);
  if (!matchedInput) {
    return undefined;
  }
  const cleanedInput = matchedInput.join('');
  const parseMode = getParseMode(cleanedInput, options);
  switch (parseMode) {
    case 'unparseable': {
      const cleanedInputMatchStr = cleanedInput.match(/[0-9]/g)?.join('');
      if (!cleanedInputMatchStr) {
        return NaN;
      }
      return parseFloat(cleanedInputMatchStr);
    }
    case 'withLocale':
      return parseWithLocale(cleanedInput, options || {});
    case 'heuristic':
      return parseHeuristic(cleanedInput);
    default:
      return 0;
  }
}
