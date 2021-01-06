import { localize } from '../../localize.js';

/**
 * When number is NaN we should return an empty string or returnIfNaN param
 *
 * @param {string|undefined} returnIfNaN
 * @returns {string}
 */
export function emptyStringWhenNumberNan(returnIfNaN) {
  return returnIfNaN || localize.formatNumberOptions.returnIfNaN;
}
