import { Validator } from '@lion/ui/form-core.js';
import { PhoneUtilManager } from './PhoneUtilManager.js';

/**
 * @typedef {import('../types/index.js').RegionCode} RegionCode
 * @typedef {* & import('awesome-phonenumber').default} AwesomePhoneNumber
 * @typedef {import('../../form-core/types/validate/validate.js').FeedbackMessageData} FeedbackMessageData
 */

/**
 * @param {string} modelValue
 * @param {RegionCode} regionCode
 * @returns {false|'invalid-country-code'|'unknown'|'too-long'|'too-short'}
 */
function hasFeedback(modelValue, regionCode) {
  // eslint-disable-next-line prefer-destructuring
  const PhoneNumber = /** @type {AwesomePhoneNumber} */ (PhoneUtilManager.PhoneUtil);
  let invalidCountryCode = false;

  if (regionCode && modelValue?.length >= 4 && modelValue?.length <= 16) {
    let pn;
    try {
      pn = PhoneNumber.parsePhoneNumber(modelValue, { regionCode });
      invalidCountryCode = pn.regionCode !== regionCode;
      if (invalidCountryCode) {
        return 'invalid-country-code';
      }
      // eslint-disable-next-line no-empty
    } catch (_) {}
    // too-short/too-long info seems to be not there (we get 'is-possible'?)
    const enumValue = !pn.valid ? pn.possibility : false;
    if (enumValue === 'is-possible') {
      return 'unknown';
    }
    return enumValue;
  }

  return 'unknown';
}

export class PhoneNumber extends Validator {
  static validatorName = 'PhoneNumber';

  static get async() {
    // Will be run as async the first time if PhoneUtilManager hasn't loaded yet, sync afterwards
    return !PhoneUtilManager.isLoaded;
  }

  /**
   * @param {string} modelValue telephone number without country prefix
   * @param {RegionCode} regionCode
   */
  // eslint-disable-next-line class-methods-use-this
  execute(modelValue, regionCode) {
    if (!PhoneUtilManager.isLoaded) {
      // Return a Promise once not loaded yet. Since async Validators are meant for things like
      // loading server side data (in this case a lib), we continue as a sync Validator once loaded
      return new Promise(resolve => {
        PhoneUtilManager.loadComplete.then(() => {
          resolve(hasFeedback(modelValue, regionCode));
        });
      });
    }
    return hasFeedback(modelValue, regionCode);
  }
}
