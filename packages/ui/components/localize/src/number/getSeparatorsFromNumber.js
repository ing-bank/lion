/**
 *
 * @param {number} parsedNumber
 * @param {string} formattedNumber
 * @param {import('../../types/LocalizeMixinTypes.js').FormatNumberOptions} [options]
 * @returns {{groupSeparator: string|null, decimalSeparator: string|null}}
 */
export function getSeparatorsFromNumber(parsedNumber, formattedNumber, options) {
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

  let groupSeparator = null;
  let decimalSeparator = null;
  if (separators) {
    if (separators.length === 1) {
      const parts = formattedNumber.split(separators[0]);
      // Not sure if decimal or group, because only 1 separator.
      // if the separator is followed by at least 3 or more digits
      // and if the original number value is more or equal than 1000 or less or equal than -1000
      // or the minimum integer digits is forced to more than 3,
      // it has to be the group separator
      if (
        parts[1].replace(/[^0-9]/g, '').length >= 3 &&
        (parsedNumber >= 1000 ||
          parsedNumber <= -1 * 1000 ||
          (options?.minimumIntegerDigits && options.minimumIntegerDigits > 3))
      ) {
        [groupSeparator] = separators;
      } else {
        [decimalSeparator] = separators;
      }
    } else if (separators.every(val => val === separators[0])) {
      // multiple separators, check if they are all the same or not
      // if the same, it means they are group separators
      // if not, it means that the last one must be the decimal separator
      [groupSeparator] = separators;
    } else {
      [groupSeparator] = separators;
      decimalSeparator = separators[separators.length - 1];
    }
  }

  return {
    groupSeparator,
    decimalSeparator,
  };
}
