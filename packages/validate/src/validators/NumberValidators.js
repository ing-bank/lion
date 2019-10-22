/* eslint-disable max-classes-per-file */
import { Validator } from '../Validator.js';

/**
 * check for not being NaN (NaN is the only value in javascript which is not equal to itself)
 *
 * @param {number} value to check
 */
function isNumber(value) {
  return value === value && typeof value === 'number'; // eslint-disable-line no-self-compare
}

export class IsNumber extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'IsNumber';
  }

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
  constructor(...args) {
    super(...args);
    this.name = 'MinNumber';
  }

  execute(value, min = this.param) {
    let isEnabled = false;
    if (!isNumber(value) || value < min) {
      isEnabled = true;
    }
    return isEnabled;
  }
}

export class MaxNumber extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'MaxNumber';
  }

  execute(value, max = this.param) {
    let isEnabled = false;
    if (!isNumber(value) || value > max) {
      isEnabled = true;
    }
    return isEnabled;
  }
}

export class MinMaxNumber extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'MinMaxNumber';
  }

  execute(value, { min = 0, max = 0 } = this.param) {
    let isEnabled = false;
    if (!isNumber(value) || value < min || value > max) {
      isEnabled = true;
    }
    return isEnabled;
  }
}
