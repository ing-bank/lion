import { storiesOf, html } from '@open-wc/demoing-storybook';
import {
  equalsLengthValidator,
  minLengthValidator,
  maxLengthValidator,
  minMaxLengthValidator,
  isEmailValidator,
  Validator,
} from '@lion/validate';
import { LocalizeMixin } from '@lion/localize';
import { Required, EqualsLength, MinDate } from '@lion/validate/src/validators.js';
import '@lion/validate/provision-feedback-messages.js';
import '@lion/input-date/lion-input-date.js';

import { LionInput } from '../index.js';
import { aTimeout } from '@open-wc/testing';


storiesOf('Forms|Input String Validation', module)
  .add(
    'equalsLength',
    () => html`
      <lion-input
        .errorValidators=${[equalsLengthValidator(7)]}
        .modelValue=${'not exactly'}
        label="equalsLengthValidator"
      ></lion-input>
      <lion-input
        .errorValidators=${[equalsLengthValidator(7)]}
        .modelValue=${'exactly'}
        label="equalsLengthValidator"
      ></lion-input>
    `,
  )
  .add(
    'minLength',
    () => html`
      <lion-input
        .errorValidators=${[minLengthValidator(10)]}
        .modelValue=${'too short'}
        label="minLengthValidator"
      ></lion-input>
      <lion-input
        .errorValidators=${[minLengthValidator(10)]}
        .modelValue=${'that should be enough'}
        label="minLengthValidator"
      ></lion-input>
    `,
  )
  .add(
    'maxLength',
    () => html`
      <lion-input
        .errorValidators=${[maxLengthValidator(13)]}
        .modelValue=${'too long it seems'}
        label="maxLengthValidator"
      ></lion-input>
      <lion-input
        .errorValidators=${[maxLengthValidator(13)]}
        .modelValue=${'just perfect'}
        label="maxLengthValidator"
      ></lion-input>
    `,
  )
  .add(
    'minMaxLength',
    () => html`
      <lion-input
        .errorValidators=${[minMaxLengthValidator({ min: 10, max: 13 })]}
        .modelValue=${'too short'}
        label="minMaxLengthValidator"
      ></lion-input>
      <lion-input
        .errorValidators=${[minMaxLengthValidator({ min: 10, max: 13 })]}
        .modelValue=${'too long it seems'}
        label="minMaxLengthValidator"
      ></lion-input>
      <lion-input
        .errorValidators=${[minMaxLengthValidator({ min: 10, max: 13 })]}
        .modelValue=${'just perfect'}
        label="minMaxLengthValidator"
      ></lion-input>
    `,
  )
  .add(
    'isEmail',
    () => html`
      <lion-input
        .errorValidators=${[isEmailValidator()]}
        .modelValue=${'foo'}
        label="isEmailValidator"
      ></lion-input>
      <lion-input
        .errorValidators=${[isEmailValidator()]}
        .modelValue=${'foo@bar.com'}
        label="isEmailValidator"
      ></lion-input>
    `,
  )
  .add('error/warning/info/success states', () => {
    class InputValidationExample extends LocalizeMixin(LionInput) {
      static get localizeNamespaces() {
        return [
          { 'input-validation-example': locale => import(`./translations/${locale}.js`) },
          ...super.localizeNamespaces,
        ];
      }
    }
    if (!customElements.get('input-validation-example')) {
      customElements.define('input-validation-example', InputValidationExample);
    }

    const notEqualsString = (value, stringValue) => stringValue.toString() !== value;
    const notEqualsStringValidator = (...factoryParams) => [
      (...params) => ({ notEqualsString: notEqualsString(...params) }),
      factoryParams,
    ];
    const equalsStringFixedValidator = () => [() => ({ notEqualsStringFixed: false })];
    return html`
      <input-validation-example
        .errorValidators=${[notEqualsStringValidator('error')]}
        .successValidators=${[equalsStringFixedValidator()]}
        .modelValue=${'error'}
        label="Error"
        help-text="Clearing the error (add a character) will show a success message"
      ></input-validation-example>
      <input-validation-example
        .warningValidators=${[notEqualsStringValidator('warning')]}
        .modelValue=${'warning'}
        label="Warning"
      ></input-validation-example>
      <input-validation-example
        .infoValidators=${[notEqualsStringValidator('info')]}
        .modelValue=${'info'}
        label="Info"
      ></input-validation-example>
    `;
  })
  .add('error/warning/info/success states', () => {
    class InputValidationExample extends LocalizeMixin(LionInput) {
      static get localizeNamespaces() {
        return [
          { 'input-validation-example': locale => import(`./translations/${locale}.js`) },
          ...super.localizeNamespaces,
        ];
      }
    }
    if (!customElements.get('input-validation-example')) {
      customElements.define('input-validation-example', InputValidationExample);
    }

    const notEqualsString = (value, stringValue) => stringValue.toString() !== value;
    const notEqualsStringValidator = (...factoryParams) => [
      (...params) => ({ notEqualsString: notEqualsString(...params) }),
      factoryParams,
    ];
    const equalsStringFixedValidator = () => [() => ({ notEqualsStringFixed: false })];
    return html`
      <input-validation-example
        .errorValidators=${[notEqualsStringValidator('error')]}
        .successValidators=${[equalsStringFixedValidator()]}
        .modelValue=${'error'}
        label="Error"
        help-text="Clearing the error (add a character) will show a success message"
      ></input-validation-example>
      <input-validation-example
        .warningValidators=${[notEqualsStringValidator('warning')]}
        .modelValue=${'warning'}
        label="Warning"
      ></input-validation-example>
      <input-validation-example
        .infoValidators=${[notEqualsStringValidator('info')]}
        .modelValue=${'info'}
        label="Info"
      ></input-validation-example>
    `;
  })
  .add('New(!!):', () => html`
      <lion-input
        .validators="${[new EqualsLength(7)]}"
        .modelValue="${'not exactly'}"
        label="equalsLengthValidator"
      ></lion-input>
      <lion-input
        .validators="${[new Required(), new EqualsLength(7, { type: 'warning' })]}"
        .modelValue="${'exactly'}"
        label="equalsLengthValidator"
      ></lion-input>
    `,
  )
  .add('New(!!): Custom Validator', () => {
    class MyValidator extends Validator {
      constructor(...args) {
        super(...args);
        this.name = 'myValidator';
      }

      execute(modelValue, param) {
        return modelValue === param;
      }

      static getMessage({ fieldName, modelValue, validatorParams: param }) {
        if ((modelValue.length >= param.length -1) && param.startsWith(modelValue)) {
          return 'Almost there...';
        }
        return `No "${param}" found in ${fieldName}`;
      }
    }

    return html`
      <lion-input
        label="Custom validator"
        help-text="Type 'mine' please"
        .validators="${[new MyValidator('mine')]}"
        .modelValue="${'mi'}"
      ></lion-input>
    `;
  })
  .add('New(!!): Override Messages per instance', () => html`
      <lion-input
        .validators="${[new EqualsLength(4, { message: '4 chars please...' })]}"
        .modelValue="${'123'}"
        label="Custom message for validator instance"
      ></lion-input>
      <lion-input
        .validators="${[new EqualsLength(4, {
          message: ({ modelValue, validatorParams: param }) => {
            const diff = modelValue.length - param;
            return `${Math.abs(diff)} too ${diff > 0 ? 'much' : 'little'}...`;
          }
        })]}"
        .modelValue="${'way too much'}"
        label="Dynamic message for validator instance"
      ></lion-input>
  `)
  .add('New(!!): Async', () => {
    class AsyncValidator extends Validator {
      constructor(...args) {
        super(...args);
        this.name = 'asyncValidator';
        this.async = true;
      }

      async execute() {
        console.log('async pending...');
        await aTimeout(2000);
        console.log('async done...');
        return false;
      }

      static getMessage({ modelValue }) {
        return `validated for modelValue: ${modelValue}...`;
      }
    }

    return html`
      <style>
        lion-input[is-pending] {
          opacity: 0.5;
        }
      </style>
      <lion-input
        label="Async validation"
        .validators="${[new AsyncValidator()]}"
        .modelValue="${'123'}"
      ></lion-input>
    `;
  })
  .add('New(!!): Dynamic parameter changes', () => {
    const beginDate = new Date('09/09/1990');
    const minDateValidatorRef = new MinDate(beginDate, {
      message: 'Fill in a date after your birth date',
    });

    return html`
      <lion-input-date
        label="Your birth date"
        help-text="Adjust this date to retrigger validation of the input below..."
        .modelValue="${beginDate}"
        @model-value-changed="${({ target: { modelValue, errorState } }) => {
          if (!errorState) {
            // Since graduation date is usually not before birth date
            minDateValidatorRef.param = modelValue;
          }
        }}"
      ></lion-input-date>
      <lion-input-date
        label="Your graduation date"
        .modelValue="${new Date('09/09/1989')}"
        .validators="${[minDateValidatorRef]}"
      ></lion-input-date>
    `;
  });
