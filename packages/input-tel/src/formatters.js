import { PhoneUtilManager } from './PhoneUtilManager.js';

/**
 * @typedef {import('../types').FormatStrategy} FormatStrategy
 * @typedef {import('../types').RegionCode} RegionCode
 * @typedef {* & import('@lion/input-tel/lib/awesome-phonenumber-esm').default} PhoneNumber
 */

/**
 * @param {string} modelValue
 * @param {object} options
 * @param {RegionCode} options.regionCode
 * @param {FormatStrategy} [options.formatStrategy='international']
 * @returns {string}
 */
export function formatPhoneNumber(modelValue, { regionCode, formatStrategy = 'international' }) {
  // Do not format when not loaded
  if (!PhoneUtilManager.isLoaded) {
    return modelValue;
  }

  // eslint-disable-next-line prefer-destructuring
  const PhoneNumber = /** @type {PhoneNumber} */ (PhoneUtilManager.PhoneNumber);

  let pn;
  try {
    pn = new PhoneNumber(modelValue, regionCode); // phoneNumberUtil.parse(modelValue, regionCode);
    // eslint-disable-next-line no-empty
  } catch (_) {}

  if (modelValue?.length >= 4 && modelValue?.length <= 16 && pn?.isValid()) {
    let formattedValue;

    switch (formatStrategy) {
      case 'e164':
        formattedValue = pn.getNumber('e164'); // -> '+46707123456' (default)
        break;
      case 'international':
        formattedValue = pn.getNumber('international'); // -> '+46 70 712 34 56'
        break;
      case 'national':
        formattedValue = pn.getNumber('national'); // -> '070-712 34 56'
        break;
      case 'rfc3966':
        formattedValue = pn.getNumber('rfc3966'); // -> 'tel:+46-70-712-34-56'
        break;
      case 'significant':
        formattedValue = pn.getNumber('significant'); // -> '707123456'
        break;
      default:
        break;
    }
    return formattedValue;
  }

  return modelValue;
}
