import { isValidIBAN } from '@bundled-es-modules/ibantools';

/**
 * Parses an IBAN trimming spaces and making uppercase.
 *
 * @param {string} viewValue value to be parsed
 * @return {string} parsed value
 */
export function parseIBAN(viewValue) {
  const trimmedValue = viewValue.replace(/\s/g, '').toUpperCase();
  return isValidIBAN(trimmedValue) ? trimmedValue : undefined;
}
