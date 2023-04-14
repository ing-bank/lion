import { PhoneUtilManager } from './PhoneUtilManager.js';

/**
 * @typedef {import('awesome-phonenumber').PhoneNumberFormat} PhoneNumberFormat
 * @typedef {import('../types/index.js').RegionCode} RegionCode
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

  const AwesomePhoneNumber = PhoneUtilManager.PhoneUtil;

  let pn;
  try {
    pn = AwesomePhoneNumber.parsePhoneNumber(modelValue, { regionCode });
    // eslint-disable-next-line no-empty
  } catch (_) {}

  if (modelValue?.length >= 4 && modelValue?.length <= 16 && pn?.valid) {
    let formattedValue;

    switch (formatStrategy) {
      case 'e164':
        formattedValue = pn.number.e164; // -> '+46707123456' (default)
        break;
      case 'international':
        formattedValue = pn.number.international; // -> '+46 70 712 34 56'
        break;
      case 'national':
        formattedValue = pn.number.national; // -> '070-712 34 56'
        break;
      case 'rfc3966':
        formattedValue = pn.number.rfc3966; // -> 'tel:+46-70-712-34-56'
        break;
      case 'significant':
        formattedValue = pn.number.significant; // -> '707123456'
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
