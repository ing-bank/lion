import { localize } from '../localize.js';

/**
 * When number is NaN we should return an empty string or returnIfNaN param
 *
 * @param {string} returnIfNaN
 * @returns {*}
 */
export function emptyStringWhenNumberNan(returnIfNaN) {
  const stringToReturn = returnIfNaN || localize.formatNumberOptions.returnIfNaN;
  return stringToReturn;
}
