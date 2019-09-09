/* eslint-disable max-classes-per-file */
import { Validator } from './Validator.js';

import {
  defaultOk,
  isDateDisabled,
  equalsLength,
  isDate,
  isEmail,
  isNumber,
  isString,
  maxDate,
  maxLength,
  maxNumber,
  minDate,
  minLength,
  minMaxDate,
  minMaxLength,
  minMaxNumber,
  minNumber,
  randomOk,
} from './legacy-validators.js';

export class Required extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'required';
  }

  // eslint-disable-next-line class-methods-use-this
  onFormControlConnect(formControl) {
    if (formControl.inputElement) {
      formControl.inputElement.setAttribute('aria-required', 'true');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  onFormControlDisconnect(formControl) {
    if (formControl.inputElement) {
      formControl.inputElement.removeAttribute('aria-required');
    }
  }
};

export class EqualsLength extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'equalsLength';
    this.execute = equalsLength;
  }
};

export class IsDateDisabled extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'isDateDisabled';
    this.execute = isDateDisabled;
  }
};

export class IsDate extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'isDate';
    this.execute = isDate;
  }
};

export class MinDate extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'minDate';
    this.execute = minDate;
  }
};

export class MaxDate extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'maxDate';
    this.execute = maxDate;
  }
};

export class MinMaxDate extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'minMaxDate';
    this.execute = minMaxDate;
  }
};

export class IsEmail extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'isEmail';
    this.execute = isEmail;
  }
};

export class IsNumber extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'isNumber';
    this.execute = isNumber;
  }
};

export class IsString extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'isString';
    this.execute = isString;
  }
};
