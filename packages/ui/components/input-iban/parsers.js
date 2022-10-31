import { isValidIBAN } from 'ibantools';

/**
 * Parses an IBAN trimming spaces and making uppercase.
 *
 * @param {string} viewValue value to be parsed
 * @return {string|undefined} parsed value
 */
export function parseIBAN(viewValue) {
  const trimmedValue = viewValue.replace(/\s/g, '').toUpperCase();
  return isValidIBAN(trimmedValue) ? trimmedValue : undefined;
}
