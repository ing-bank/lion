/**
 *
 * @param {number} parsedNumber
 * @param {string} formattedNumber
 * @param {import('../../types/LocalizeMixinTypes').FormatNumberOptions} [options]
 * @returns {{thousandSeparator: string|null, decimalSeparator: string|null}}
 */
export function getSeparators(parsedNumber, formattedNumber, options) {
  // separator can only happen if there is at least 1 digit before and after the separator
  // eslint-disable-next-line no-irregular-whitespace
  const regexSeparator = /[0-9](?<sep>[\s,. _ '])[0-9]/g;

  /** @type {string[]} */
  const separators = [];
  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = regexSeparator.exec(formattedNumber)) !== null) {
    if (match.groups && match.groups.sep) {
      separators.push(match.groups?.sep);
    }
  }

  let thousandSeparator = null;
  let decimalSeparator = null;
  if (separators) {
    if (separators.length === 1) {
      const parts = formattedNumber.split(separators[0]);
      // Not sure if decimal or thousand, because only 1 separator.
      // if the separator is followed by at least 3 or more digits
      // and if the original number value is more or equal than 1000 or less or equal than -1000
      // or the minimum integer digits is forced to more than 3,
      // it has to be the thousand separator
      if (
        parts[1].replace(/[^0-9]/g, '').length >= 3 &&
        (parsedNumber >= 1000 ||
          parsedNumber <= -1 * 1000 ||
          (options?.minimumIntegerDigits && options.minimumIntegerDigits > 3))
      ) {
        [thousandSeparator] = separators;
      } else {
        [decimalSeparator] = separators;
      }
    } else if (separators.every(val => val === separators[0])) {
      // multiple separators, check if they are all the same or not
      // if the same, it means they are thousand separators
      // if not, it means that the last one must be the decimal separator
      [thousandSeparator] = separators;
    } else {
      [thousandSeparator] = separators;
      decimalSeparator = separators[separators.length - 1];
    }
  }

  return {
    thousandSeparator,
    decimalSeparator,
  };
}
