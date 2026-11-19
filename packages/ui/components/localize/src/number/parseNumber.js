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
 * @param {{mode?:'auto'|'pasted'|'user-edited'; viewValueStates?:string[]}} options
 * @return {string} unparseable|withLocale|heuristic
 */
function getParseMode(value, { mode = 'auto', viewValueStates } = {}) {
  const separatorsRe = /[., ]/g;
  const separators = value.match(separatorsRe) || [];
  // @ts-expect-error [wait-for-platform-types]
  const decimalPlaces = (value.split(separatorsRe) || []).at(-1).length;
  const isCurViewFormattedAndUserIsEditing =
    viewValueStates?.includes('formatted') && mode === 'user-edited';

  // When a user edits an existing value, we already formatted it with a certain locale.
  // For best UX, we stick with this locale. However, we only do this when the user has
  // entered at least 3 decimal places.
  const shouldUseCurLocale = isCurViewFormattedAndUserIsEditing && decimalPlaces > 2;

  const shouldUseLocale =
    shouldUseCurLocale ||
    !separators.length ||
    (mode === 'auto' && separators.length === 1 && decimalPlaces >= 3);
  if (shouldUseLocale) {
    return 'withLocale';
  }

  const shouldUseHeuristic =
    (isCurViewFormattedAndUserIsEditing && decimalPlaces <= 2) ||
    separators.length === 1 ||
    separators[0] !== separators[separators.length - 1];
  if (shouldUseHeuristic) {
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
  const separator = getDecimalSeparator(options?.locale, options);
  const regexNumberAndLocaleSeparator = new RegExp(`[0-9${separator}-]`, 'g');
  // `value` always contains a digit (see parseNumber), so the match is never null
  let numberAndLocaleSeparator = /** @type {RegExpMatchArray} */ (
    value.match(regexNumberAndLocaleSeparator)
  ).join('');
  if (separator === ',') {
    numberAndLocaleSeparator = numberAndLocaleSeparator.replace(',', '.');
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
  // 1. put placeholder at decimal separator
  const numberString = value
    .replace(/(,|\.)([^,|.]*)$/g, '_decSep_$2')
    .replace(/(,|\.| )/g, '') // 2. remove all group separators
    .replace(/_decSep_/, '.'); // 3. restore decimal separator
  return parseFloat(numberString);
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
  const valueM = value.replace(/[−]/g, '-'); // U+002D, Hyphen-Minus, &#45;
  // `value` contains a digit (checked above), so neither this match nor the ones in the parse
  // functions below can be null
  const cleanedInput = /** @type {RegExpMatchArray} */ (valueM.match(/[0-9,.\- ]/g)).join('');
  const parseMode = getParseMode(cleanedInput, options);
  switch (parseMode) {
    case 'unparseable':
      return parseFloat(/** @type {RegExpMatchArray} */ (cleanedInput.match(/[0-9-]/g)).join(''));
    case 'withLocale':
      return parseWithLocale(cleanedInput, options || {});
    default:
      // 'heuristic', the only other mode getParseMode returns
      return parseHeuristic(cleanedInput);
  }
}
