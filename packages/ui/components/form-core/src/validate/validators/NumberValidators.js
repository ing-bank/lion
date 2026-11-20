/* eslint-disable max-classes-per-file */
import { Validator } from '../Validator.js';

/**
 * @param {any} value
 */
const getAmount = value => (value !== null && typeof value === 'object' ? value.amount : value);

/**
 * check for not being NaN (NaN is the only value in javascript which is not equal to itself)
 *
 * @param {number} value to check
 */
const isNumber = value =>
  // eslint-disable-next-line no-self-compare
  value === value && typeof value === 'number';

export class IsNumber extends Validator {
  static get validatorName() {
    return 'IsNumber';
  }

  /**
   * @param {any} modelValue
   */
  // eslint-disable-next-line class-methods-use-this
  execute(modelValue) {
    const value = getAmount(modelValue);
    let isEnabled = false;
    if (!isNumber(value)) {
      isEnabled = true;
    }
    return isEnabled;
  }
}

export class MinNumber extends Validator {
  static get validatorName() {
    return 'MinNumber';
  }

  /**
   * @param {any} modelValue
   */
  execute(modelValue, min = this.param) {
    const value = getAmount(modelValue);
    let isEnabled = false;
    if (!isNumber(value) || value < min) {
      isEnabled = true;
    }
    return isEnabled;
  }
}

export class MaxNumber extends Validator {
  static get validatorName() {
    return 'MaxNumber';
  }

  /**
   * @param {any} modelValue
   */
  execute(modelValue, max = this.param) {
    const value = getAmount(modelValue);
    let isEnabled = false;
    if (!isNumber(value) || value > max) {
      isEnabled = true;
    }
    return isEnabled;
  }
}

export class MinMaxNumber extends Validator {
  static get validatorName() {
    return 'MinMaxNumber';
  }

  /**
   * @param {any} modelValue
   */
  execute(modelValue, { min = 0, max = 0 } = this.param) {
    const value = getAmount(modelValue);
    let isEnabled = false;
    if (!isNumber(value) || value < min || value > max) {
      isEnabled = true;
    }
    return isEnabled;
  }
}
