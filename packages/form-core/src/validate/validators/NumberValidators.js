/* eslint-disable max-classes-per-file */
import { Validator } from '../Validator.js';

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
   * @param {?} value
   */
  // eslint-disable-next-line class-methods-use-this
  execute(value) {
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
   * @param {?} value
   */
  execute(value, min = this.param) {
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
   * @param {?} value
   */
  execute(value, max = this.param) {
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
   * @param {?} value
   */
  execute(value, { min = 0, max = 0 } = this.param) {
    let isEnabled = false;
    if (!isNumber(value) || value < min || value > max) {
      isEnabled = true;
    }
    return isEnabled;
  }
}
