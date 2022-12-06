import { PhoneUtilManager } from './PhoneUtilManager.js';

/**
 * @typedef {import('../types/index.js').RegionCode} RegionCode
 */

/**
 * @param {string} viewValue
 * @param {{regionCode:RegionCode}} options
 * @returns {string}
 */
export function parsePhoneNumber(viewValue, { regionCode }) {
  // Do not format when not loaded
  if (!PhoneUtilManager.isLoaded) {
    return viewValue;
  }

  // eslint-disable-next-line prefer-destructuring
  const AwesomePhoneNumber = PhoneUtilManager.PhoneUtil;
  const regex = /[+0-9]+/gi;
  const strippedViewValue = viewValue.match(regex)?.join('');
  let pn;
  try {
    pn = AwesomePhoneNumber.parsePhoneNumber(strippedViewValue, { regionCode });
    // eslint-disable-next-line no-empty
  } catch (_) {}

  if (pn?.number) {
    return pn.number.e164;
  }

  return viewValue;
}
