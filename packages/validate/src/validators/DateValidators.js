/* eslint-disable max-classes-per-file */
import { Validator } from '../Validator.js';

export class EqualsLength extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'equalsLength';
    this.execute = (...arg) => !equalsLength(...arg);
  }
}

export class MaxLength extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'maxLength';
    this.execute = (...arg) => !maxLength(...arg);
  }
}

export class MinLength extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'minLength';
    this.execute = (...arg) => minLength(...arg);
  }
}

export class MinMaxLength extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'minMaxLength';
    this.execute = (...arg) => !minMaxLength(...arg);
  }
}
