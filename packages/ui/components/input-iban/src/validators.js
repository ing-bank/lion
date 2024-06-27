/* eslint-disable max-classes-per-file, import/no-extraneous-dependencies */

import { Validator } from '@lion/ui/form-core.js';
import { isValidIBAN } from 'ibantools';

export class IsIBAN extends Validator {
  static get validatorName() {
    return 'IsIBAN';
  }

  /** @param {string} value */
  // eslint-disable-next-line class-methods-use-this
  execute(value) {
    return !isValidIBAN(value);
  }
}

export class IsCountryIBAN extends IsIBAN {
  static get validatorName() {
    return 'IsCountryIBAN';
  }

  /**
   * @param {string} modelValue
   * @returns {Boolean}
   */
  execute(modelValue) {
    let isInvalid = false;
    const notIBAN = super.execute(modelValue);
    if (typeof this.param === 'string') {
      if (String(modelValue.slice(0, 2)) !== this.param.toUpperCase()) {
        isInvalid = true;
      }
    } else if (Array.isArray(this.param)) {
      isInvalid = !this.param.some(
        country => String(modelValue.slice(0, 2)) === country.toUpperCase(),
      );
    }
    if (notIBAN) {
      isInvalid = true;
    }
    return isInvalid;
  }
}

export class IsNotCountryIBAN extends IsIBAN {
  static get validatorName() {
    return 'IsNotCountryIBAN';
  }

  /**
   * @param {string} modelValue
   * @returns {Boolean}
   */
  execute(modelValue) {
    let isInvalid = false;
    const notIBAN = super.execute(modelValue);
    if (typeof this.param === 'string') {
      if (String(modelValue.slice(0, 2)) === this.param.toUpperCase()) {
        isInvalid = true;
      }
    } else if (Array.isArray(this.param)) {
      isInvalid = this.param.some(
        country => String(modelValue.slice(0, 2)) === country.toUpperCase(),
      );
    }

    if (notIBAN) {
      isInvalid = true;
    }
    return isInvalid;
  }
}
