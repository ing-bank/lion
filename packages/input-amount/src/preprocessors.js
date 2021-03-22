/**
 * Preprocesses by removing non-digits
 * Allows space, comma and dot as separator characters
 *
 * @param {string} value Number to format
 */
export function preprocessAmount(value) {
  return value.replace(/[^0-9,. ]/g, '');
}
