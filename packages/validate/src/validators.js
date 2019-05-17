export const isString = value => typeof value === 'string';
export const isStringValidator = () => [(...params) => ({ isString: isString(...params) })];

export const equalsLength = (value, length) => isString(value) && value.length === length;
export const equalsLengthValidator = (...factoryParams) => [
  (...params) => ({ equalsLength: equalsLength(...params) }),
  ...factoryParams,
];

export const minLength = (value, min) => isString(value) && value.length >= min;
export const minLengthValidator = (...factoryParams) => [
  (...params) => ({ minLength: minLength(...params) }),
  ...factoryParams,
];

export const maxLength = (value, max) => isString(value) && value.length <= max;
export const maxLengthValidator = (...factoryParams) => [
  (...params) => ({ maxLength: maxLength(...params) }),
  ...factoryParams,
];

export const minMaxLength = (value, { min = 0, max = 0 }) =>
  isString(value) && value.length >= min && value.length <= max;
export const minMaxLengthValidator = (...factoryParams) => [
  (...params) => ({ minMaxLength: minMaxLength(...params) }),
  ...factoryParams,
];

const isEmailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const isEmail = value => isString(value) && isEmailRegex.test(value.toLowerCase());
export const isEmailValidator = () => [(...params) => ({ isEmail: isEmail(...params) })];

/**
 * check for not being NaN (NaN is the only value in javascript which is not equal to itself)
 *
 * @param {number} value to check
 */
export const isNumber = value => value === value && typeof value === 'number'; // eslint-disable-line no-self-compare
export const isNumberValidator = () => [(...params) => ({ isNumber: isNumber(...params) })];

export const minNumber = (value, min) => isNumber(value) && value >= min;
export const minNumberValidator = (...factoryParams) => [
  (...params) => ({ minNumber: minNumber(...params) }),
  ...factoryParams,
];

export const maxNumber = (value, max) => isNumber(value) && value <= max;
export const maxNumberValidator = (...factoryParams) => [
  (...params) => ({ maxNumber: maxNumber(...params) }),
  ...factoryParams,
];

export const minMaxNumber = (value, { min = 0, max = 0 }) =>
  isNumber(value) && value >= min && value <= max;
export const minMaxNumberValidator = (...factoryParams) => [
  (...params) => ({ minMaxNumber: minMaxNumber(...params) }),
  ...factoryParams,
];

export const isDate = value =>
  Object.prototype.toString.call(value) === '[object Date]' && !Number.isNaN(value.getTime());
export const isDateValidator = () => [(...params) => ({ isDate: isDate(...params) })];

export const minDate = (value, min) => isDate(value) && value >= min;
export const minDateValidator = (...factoryParams) => [
  (...params) => ({ minDate: minDate(...params) }),
  ...factoryParams,
];

export const maxDate = (value, max) => isDate(value) && value <= max;
export const maxDateValidator = (...factoryParams) => [
  (...params) => ({ maxDate: maxDate(...params) }),
  ...factoryParams,
];

export const minMaxDate = (value, { min = 0, max = 0 }) =>
  isDate(value) && value >= min && value <= max;
export const minMaxDateValidator = (...factoryParams) => [
  (...params) => ({ minMaxDate: minMaxDate(...params) }),
  ...factoryParams,
];

export const isDateDisabled = (value, isDisabledFn) => isDate(value) && !isDisabledFn(value);
export const isDateDisabledValidator = (...factoryParams) => [
  (...params) => ({ isDateDisabled: isDateDisabled(...params) }),
  ...factoryParams,
];

export const randomOk = () => false;
export const randomOkValidator = () => [(...params) => ({ randomOk: randomOk(...params) })];

export const defaultOk = () => false;
export const defaultOkValidator = () => [(...params) => ({ defaultOk: defaultOk(...params) })];
