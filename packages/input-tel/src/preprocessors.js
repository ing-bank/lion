import { PhoneUtilManager } from './PhoneUtilManager.js';
import { formatPhoneNumber } from './formatters.js';

/**
 * @typedef {import('../types').RegionCode} RegionCode
 * @typedef {import('awesome-phonenumber').PhoneNumberFormat} PhoneNumberFormat
 * @typedef {* & import('awesome-phonenumber').default} AwesomePhoneNumber
 */

/**
 * @param {string} viewValue
 * @param {object} options
 * @param {RegionCode} options.regionCode
 * @param {string} options.prevViewValue
 * @param {number} options.currentCaretIndex
 * @param {PhoneNumberFormat} options.formatStrategy
 * @returns {{viewValue:string; caretIndex:number;}|undefined}
 */
export function liveFormatPhoneNumber(
  viewValue,
  { regionCode, formatStrategy, prevViewValue, currentCaretIndex },
) {
  const diff = viewValue.length - prevViewValue.length;
  // Do not format when not loaded
  if (diff <= 0 || !PhoneUtilManager.isLoaded) {
    return undefined;
  }

  // eslint-disable-next-line prefer-destructuring
  const PhoneNumber = /** @type {AwesomePhoneNumber} */ (PhoneUtilManager.PhoneUtil);
  const ayt = PhoneNumber.getAsYouType(regionCode);

  for (const char of viewValue) {
    if (char !== '') {
      ayt.addChar(char);
    }
  }

  const newViewValue = formatPhoneNumber(ayt.number(), { regionCode, formatStrategy });

  /**
   * Given following situation:
   * - viewValue: `+316123`
   * - currentCaretIndex: 2 (inbetween 3 and 1)
   * - prevViewValue `+36123` (we inserted '1' at position 2)
   * => we should get `+31 6123`, and new caretIndex should be 3, and not newViewValue.length
   */
  const diffBetweenNewAndCurrent = newViewValue.length - viewValue.length;
  const newCaretIndex = currentCaretIndex + diffBetweenNewAndCurrent;
  return newViewValue ? { viewValue: newViewValue, caretIndex: newCaretIndex } : undefined;
}
