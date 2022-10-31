import { PhoneUtilManager } from './PhoneUtilManager.js';

/**
 * @typedef {import('awesome-phonenumber').PhoneNumberFormat} PhoneNumberFormat
 * @typedef {import('../types').RegionCode} RegionCode
 * @typedef {* & import('awesome-phonenumber').default} AwesomePhoneNumber
 */

/**
 * @param {string} value
 * @param {object} options
 * @param {RegionCode} options.regionCode
 * @param {string} options.formatCountryCodeStyle
 */
export function getFormatCountryCodeStyle(value, { regionCode, formatCountryCodeStyle }) {
  const countryCode = PhoneUtilManager?.PhoneUtil?.getCountryCodeForRegionCode(regionCode);
  if (
    formatCountryCodeStyle === 'parentheses' &&
    countryCode &&
    value.includes(`+${countryCode}`) &&
    !value.includes(`(`)
  ) {
    return value.replace(`+${countryCode}`, `(+${countryCode})`);
  }
  return value;
}

/**
 * @param {string} modelValue
 * @param {object} options
 * @param {RegionCode} options.regionCode
 * @param {PhoneNumberFormat} [options.formatStrategy='international']
 * @param {string} [options.formatCountryCodeStyle='default']
 * @returns {string}
 */
export function formatPhoneNumber(
  modelValue,
  { regionCode, formatStrategy = 'international', formatCountryCodeStyle = 'default' },
) {
  // Do not format when not loaded
  if (!PhoneUtilManager.isLoaded) {
    return modelValue;
  }

  // eslint-disable-next-line prefer-destructuring
  const PhoneUtil = /** @type {AwesomePhoneNumber} */ (PhoneUtilManager.PhoneUtil);

  let pn;
  try {
    pn = new PhoneUtil(modelValue, regionCode);
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

    if (formatCountryCodeStyle !== 'default') {
      return getFormatCountryCodeStyle(formattedValue, { regionCode, formatCountryCodeStyle });
    }
    return formattedValue;
  }

  if (formatCountryCodeStyle !== 'default') {
    return getFormatCountryCodeStyle(modelValue, { regionCode, formatCountryCodeStyle });
  }
  return modelValue;
}
