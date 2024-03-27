import { friendlyFormatIBAN } from 'ibantools';

/**
 * Takes an unformatted IBAN and returns a formatted one.
 *
 * @param {string} modelValue value to be formatted
 * @return {string} formatted value
 */
export function formatIBAN(modelValue) {
  // defensive code because of ibantools
  if (!modelValue) {
    return '';
  }
  // @ts-ignore should not return null
  return friendlyFormatIBAN(modelValue);
}
