/* eslint-disable max-classes-per-file */
import { normalizeDateTime } from '@lion/localize';
import { Validator } from '../Validator.js';

function isDate(value) {
  return (
    Object.prototype.toString.call(value) === '[object Date]' && !Number.isNaN(value.getTime())
  );
}

export class IsDate extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'IsDate';
  }

  // eslint-disable-next-line class-methods-use-this
  execute(value) {
    let hasError = false;
    if (!isDate(value)) {
      hasError = true;
    }
    return hasError;
  }
}

export class MinDate extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'MinDate';
  }

  execute(value, min = this.param) {
    let hasError = false;
    if (!isDate(value) || value < normalizeDateTime(min)) {
      hasError = true;
    }
    return hasError;
  }
}

export class MaxDate extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'MaxDate';
  }

  execute(value, max = this.param) {
    let hasError = false;
    if (!isDate(value) || value > normalizeDateTime(max)) {
      hasError = true;
    }
    return hasError;
  }
}

export class MinMaxDate extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'MinMaxDate';
  }

  execute(value, { min = 0, max = 0 } = this.param) {
    let hasError = false;
    if (!isDate(value) || value < normalizeDateTime(min) || value > normalizeDateTime(max)) {
      hasError = true;
    }
    return hasError;
  }
}

export class IsDateDisabled extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'IsDateDisabled';
  }

  execute(value, isDisabledFn = this.param) {
    let hasError = false;
    if (!isDate(value) || isDisabledFn(value)) {
      hasError = true;
    }
    return hasError;
  }
}
