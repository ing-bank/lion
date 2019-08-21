import { isValidIBAN } from '@bundled-es-modules/ibantools/ibantools.js';

export const isIBAN = value => isValidIBAN(value);

export const isIBANValidator = () => [(...params) => ({ isIBAN: isIBAN(...params) })];

export const isCountryIBAN = (value, country = '') =>
  isIBAN(value) && value.slice(0, 2) === country;
export const isCountryIBANValidator = (...factoryParams) => [
  (...params) => ({ isCountryIBAN: isCountryIBAN(...params) }),
  ...factoryParams,
];
