/* eslint-disable */

/**
 * 1a. Imports 'from'
 */

import {
  isString,
  equalsLength,
  minLength,
  maxLength,
  minMaxLength,
  isEmail,
  isStringValidator,
  equalsLengthValidator,
  minLengthValidator,
  maxLengthValidator,
  minMaxLengthValidator,
  isEmailValidator,
  isNumber,
  minNumber,
  maxNumber,
  minMaxNumber,
  isNumberValidator,
  minNumberValidator,
  maxNumberValidator,
  minMaxNumberValidator,
  isDate,
  minDate,
  maxDate,
  isDateDisabled,
  minMaxDate,
  isDateValidator,
  minDateValidator,
  maxDateValidator,
  minMaxDateValidator,
  isDateDisabledValidator,
  randomOk,
  defaultOk,
  randomOkValidator,
  defaultOkValidator,
} from '@lion/validate'; // '@lion/validate/src/validators.js'

/**
 * 1b. Imports 'to'
 */

import {
  IsString,
  EqualsLength,
  MinLength,
  MaxLength,
  MinMaxLength,
  IsEmail,
  IsNumber,
  MinNumber,
  MaxNumber,
  MinMaxNumber,
  IsDate,
  MinDate,
  MaxDate,
  IsDateDisabled,
  MinMaxDate,
  DefaultSuccess,
} from '@lion/validate';

/**
 * 2a. Templates 'from'
 */

const paramRef = new Date();
const cfgRef = { con: 'fig' };

const tplFrom = html`
  <div>
    <lion-input
      .errorValidators="${[minLengthValidator(1, { x: 'asd' })]}"
      .warningValidators="${[isNumberValidator()]}"
      .infoValidators="${[maxDateValidator(paramRef, cfgRef)]}"
      .successValidators="${[[defaultOk]]}"
    >
    </lion-input>
  </div>
`;

/**
 * 2b. Templates 'to'
 */

const tplTo = html`
  <lion-input
    .validators="${[
      new MinLength(1, { x: 'asd' }),
      new IsNumber(null, { type: 'warning' }),
      new MaxDate(paramRef, { ...cfgRef, type: 'info' }),
      new DefaultSuccess(),
    ]}"
  >
  </lion-input>
`;

/**
 * 3a. Custom Validator definitions 'from'
 */

export function isIban(...args) {
  return {
    'my-app-isIban': /\d{5}([ \-]\d{4})?$/.test(args[0]),
  };
}

export const isIbanValidator = (...factoryParams) => [
  (...params) => ({ 'my-app-isIban': isIban(...params) }),
  ...factoryParams,
];

localize.loadNamespace({
  'lion-validate+my-app-isIban': locale => {
    return import(`./translations/${locale}.js`);
  },
});

/**
 * 3b. Custom Validator definitions 'to'
 */

import { Validator } from '@lion/validate';

const nsMyAppIsIban = localize.loadNamespace({
  'lion-validate+my-app-isIban': locale => {
    return import(`./translations/${locale}.js`);
  },
});

export class IsIban extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'IsIban';
  }

  execute(...args) {
    return !isIban(...args)['my-app-isIban'];
  }

  static async getMessage(data) {
    await nsMyAppIsIban;
    return localize.msg(
      'lion-validate+my-app-isIban:error.my-app-isIban',
      await transformData(data),
    );
  }
}

// TODO: Name 'IsIban' needs to be backwards compatible with eventually used:
// - .error["my-app-isIban"]
// - All references of isIbanValidator need to be replaced inside .{x}Validators
// -

/**
 * 4a. Error states (from)
 */

myInputRef.errorState;
myInputRef.error.required;

/**
 * 4a. Error states (to)
 */
myInputRef.hasError;
myInputRef.errorStates.Required;

/**
 * 5a. Configurations of default validators inside components (from)
 */
class MyComp extends HTMLElement {
  getValidatorsForType(type) {
    if (type === 'error') {
      return [isDateValidator()].concat(super.getValidatorsForType(type) || []);
    } else if (type === 'warning') {
      return [equalsLengthValidator(2)].concat(super.getValidatorsForType(type) || []);
    }
    return super.getValidatorsForType(type);
  }
}

/**
 * 5b. Configurations of default validators inside components (to)
 */

class MyCompStill extends HTMLElement {
  constructor() {
    super();
    this.defaultValidators.push(new IsDate());
    this.defaultValidators.push(new EqualsLength(2, { type: 'warning' }));
  }
}

/**
 * 6a. getFieldName (from)
 */

const tplFieldFrom = html`
  <lion-input .getFieldName="${() => 'xyz'}"></lion-input>
`;

/**
 * 6b. .fieldName (to)
 */

const tplFieldTo = html`
  <lion-input .fieldName="${'xyz'}"></lion-input>
`;

/**
 * 7a. show{Type}Condition (from)
 */

class MyCompX extends HTMLElement {
  showErrorCondition(...args) {
    const parent = super.showErrorCondition(...args);
    return parent && 1 + 1 === 3;
  }
}

/**
 * 7b. show{Type}Condition (to)
 */
class MyCompXStill extends HTMLElement {
  _prioritizeAndFilterFeedback({ validationResult }) {
    const parent = super._prioritizeAndFilterFeedback({ validationResult });
    return parent && 1 + 1 === 3;
  }
}

// '.inputElement' -> '._inputNode'
