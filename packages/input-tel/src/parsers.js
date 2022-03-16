import { PhoneUtilManager } from './PhoneUtilManager.js';

/**
 * @typedef {import('../types').RegionCode} RegionCode
 * @typedef {* & import('@lion/input-tel/lib/awesome-phonenumber-esm').default} PhoneNumber
 */

/**
 * @param {string} viewValue
 * @param {{regionCode:RegionCode;}} options
 * @returns {string}
 */
export function parsePhoneNumber(viewValue, { regionCode }) {
  // Do not format when not loaded
  if (!PhoneUtilManager.isLoaded) {
    return viewValue;
  }

  // eslint-disable-next-line prefer-destructuring
  const PhoneNumber = /** @type {PhoneNumber} */ (PhoneUtilManager.PhoneNumber);

  let pn;
  try {
    pn = PhoneNumber(viewValue, regionCode);
    // eslint-disable-next-line no-empty
  } catch (_) {}

  if (pn) {
    return pn.getNumber('e164');
  }

  return viewValue;
}
