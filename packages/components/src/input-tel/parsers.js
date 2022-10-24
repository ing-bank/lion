import { PhoneUtilManager } from './PhoneUtilManager.js';

/**
 * @typedef {import('../types').RegionCode} RegionCode
 * @typedef {* & import('awesome-phonenumber').default} AwesomePhoneNumber
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
  const PhoneNumber = /** @type {AwesomePhoneNumber} */ (PhoneUtilManager.PhoneUtil);
  const regex = /[+0-9]+/gi;
  const strippedViewValue = viewValue.match(regex)?.join('');
  let pn;
  try {
    pn = PhoneNumber(strippedViewValue, regionCode);
    // eslint-disable-next-line no-empty
  } catch (_) {}

  if (pn) {
    return pn.getNumber('e164');
  }

  return viewValue;
}
