/* eslint-disable max-classes-per-file */
import { Validator } from '../Validator.js';

const isString = value => typeof value === 'string';

export class IsString extends Validator {
  static get validatorName() {
    return 'IsString';
  }

  // eslint-disable-next-line class-methods-use-this
  execute(value) {
    let hasError = false;
    if (!isString(value)) {
      hasError = true;
    }
    return hasError;
  }
}

export class EqualsLength extends Validator {
  static get validatorName() {
    return 'EqualsLength';
  }

  execute(value, length = this.param) {
    let hasError = false;
    if (!isString(value) || value.length !== length) {
      hasError = true;
    }
    return hasError;
  }
}

export class MinLength extends Validator {
  static get validatorName() {
    return 'MinLength';
  }

  execute(value, min = this.param) {
    let hasError = false;
    if (!isString(value) || value.length < min) {
      hasError = true;
    }
    return hasError;
  }
}

export class MaxLength extends Validator {
  static get validatorName() {
    return 'MaxLength';
  }

  execute(value, max = this.param) {
    let hasError = false;
    if (!isString(value) || value.length > max) {
      hasError = true;
    }
    return hasError;
  }
}

export class MinMaxLength extends Validator {
  static get validatorName() {
    return 'MinMaxLength';
  }

  execute(value, { min = 0, max = 0 } = this.param) {
    let hasError = false;
    if (!isString(value) || value.length < min || value.length > max) {
      hasError = true;
    }
    return hasError;
  }
}

const isEmailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export class IsEmail extends Validator {
  static get validatorName() {
    return 'IsEmail';
  }

  // eslint-disable-next-line class-methods-use-this
  execute(value) {
    let hasError = false;
    if (!isString(value) || !isEmailRegex.test(value.toLowerCase())) {
      hasError = true;
    }
    return hasError;
  }
}
