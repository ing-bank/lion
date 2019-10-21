/* eslint-disable max-classes-per-file */
import { Validator } from '../Validator.js';

export class IsNumber extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'isNumber';
    this.execute = (...arg) => !isNumber(...arg);
  }
}

export class MaxNumber extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'maxNumber';
    this.execute = (...arg) => !maxNumber(...arg);
  }
}

export class MinNumber extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'minNumber';
    this.execute = (...arg) => !minNumber(...arg);
  }
}

export class MinMaxNumber extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'minMaxNumber';
    this.execute = (...arg) => !minMaxNumber(...arg);
  }
}
