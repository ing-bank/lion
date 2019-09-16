/* eslint-disable max-classes-per-file */
import { Validator } from './Validator.js';
import { ResultValidator } from './ResultValidator.js';

import {
  // defaultOk,
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
  // randomOk,
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
    this.execute = (...arg) => !equalsLength(...arg);
  }
};

export class MaxLength extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'maxLength';
    this.execute = (...arg) => !maxLength(...arg);
  }
};

export class MinLength extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'minLength';
    this.execute = (...arg) => minLength(...arg);
  }
};

export class MinMaxLength extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'minMaxLength';
    this.execute = (...arg) => !minMaxLength(...arg);
  }
};

export class IsDateDisabled extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'isDateDisabled';
    this.execute = (...arg) => !isDateDisabled(...arg);
  }
};

export class IsDate extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'isDate';
    this.execute = (...arg) => !isDate(...arg);
  }
};

export class MinDate extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'minDate';
    this.execute = (...arg) => !minDate(...arg);
  }
};

export class MaxDate extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'maxDate';
    this.execute = (...arg) => !maxDate(...arg);
  }
};

export class MinMaxDate extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'minMaxDate';
    this.execute = (...arg) => !minMaxDate(...arg);
  }
};

export class IsEmail extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'isEmail';
    this.execute = (...arg) => !isEmail(...arg);
  }
};

export class IsNumber extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'isNumber';
    this.execute = (...arg) => !isNumber(...arg);
  }
};

export class MaxNumber extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'maxNumber';
    this.execute = (...arg) => !maxNumber(...arg);
  }
};

export class MinNumber extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'minNumber';
    this.execute = (...arg) => !minNumber(...arg);
  }
};

export class MinMaxNumber extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'minMaxNumber';
    this.execute = (...arg) => !minMaxNumber(...arg);
  }
};


export class IsString extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'isString';
    this.execute = (...arg) => !isString(...arg);
  }
};

export class DefaultSuccess extends ResultValidator {
  constructor(...args) {
    super(...args);
    this.type = 'success';
  }

  // eslint-disable-next-line class-methods-use-this
  executeOnResults({ regularValidationResult, prevValidationResult }) {
    const errorOrWarning = (v) => (v.type === 'error' || v.type === 'warning');
    const hasErrorOrWarning = !!(regularValidationResult.filter(errorOrWarning).length);
    const prevHadErrorOrWarning = !!(prevValidationResult.filter(errorOrWarning).length);
    return (!hasErrorOrWarning && prevHadErrorOrWarning);
  }
}
