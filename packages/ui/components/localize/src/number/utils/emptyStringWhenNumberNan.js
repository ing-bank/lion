import { getLocalizeManager } from '../../getLocalizeManager.js';

/**
 * When number is NaN we should return an empty string or returnIfNaN param
 *
 * @param {string|undefined} returnIfNaN
 * @returns {string}
 */
export function emptyStringWhenNumberNan(returnIfNaN) {
  const localizeManager = getLocalizeManager();
  return returnIfNaN || localizeManager.formatNumberOptions.returnIfNaN;
}
