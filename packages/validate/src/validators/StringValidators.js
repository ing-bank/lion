/* eslint-disable max-classes-per-file */
import { Validator } from '../Validator.js';

const isString = value => typeof value === 'string';

export class IsString extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'IsString';
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
  constructor(...args) {
    super(...args);
    this.name = 'EqualsLength';
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
  constructor(...args) {
    super(...args);
    this.name = 'MinLength';
  }

  execute(value, min = this.param) {
    let hasError = false;
    if (!isString(value) || value.length < min) {
      hasError = true;
    }
    console.log(hasError);
    return hasError;
  }
}

export class MaxLength extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'MaxLength';
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
  constructor(...args) {
    super(...args);
    this.name = 'MinMaxLength';
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
  constructor(...args) {
    super(...args);
    this.name = 'IsEmail';
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
