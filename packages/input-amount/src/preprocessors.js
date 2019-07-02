/**
 * Formats a number considering the default fraction digits provided by Intl
 *
 * @param {float} modelValue Number to format
 * @param {object} givenOptions Options for Intl
 */
export function preprocessAmount(value) {
  return value.replace(/[^0-9,. ]/g, '');
}
