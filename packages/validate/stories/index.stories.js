/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf, html } from '@open-wc/demoing-storybook';
import {
  Required,
  EqualsLength,
  MinLength,
  MaxLength,
  MinMaxLength,
  IsNumber,
  MinNumber,
  MaxNumber,
  MinMaxNumber,
  IsDate,
  MinDate,
  MaxDate,
  MinMaxDate,
  IsEmail,
  Validator,
  loadDefaultFeedbackMessages,
  DefaultSuccess,
} from '../index.js';
import '@lion/input/lion-input.js';
import '@lion/input-amount/lion-input-amount.js';
import '@lion/input-date/lion-input-date.js';
import '@lion/input-email/lion-input-email.js';

import '../lion-validation-feedback.js';

loadDefaultFeedbackMessages();

storiesOf('Forms|Validation', module)
  .add(
    'Required Validator',
    () => html`
      <lion-input .validators="${[new Required()]}" label="Required"></lion-input>
    `,
  )
  .add(
    'String Validators',
    () => html`
      <lion-input
        .validators="${[new EqualsLength(7)]}"
        .modelValue="${'not exactly'}"
        label="EqualsLength"
      ></lion-input>
      <lion-input
        .validators="${[new MinLength(10)]}"
        .modelValue="${'too short'}"
        label="MinLength"
      ></lion-input>
      <lion-input
        .validators="${[new MaxLength(7)]}"
        .modelValue="${'too long'}"
        label="MaxLength"
      ></lion-input>
      <lion-input
        .validators="${[new MinMaxLength({ min: 10, max: 20 })]}"
        .modelValue="${'that should be enough'}"
        label="MinMaxLength"
      ></lion-input>
    `,
  )
  .add(
    'Number Validators',
    () => html`
      <lion-input-amount
        .validators="${[new IsNumber()]}"
        .modelValue="${'foo'}"
        label="IsNumber"
      ></lion-input-amount>
      <lion-input-amount
        .validators="${[new MinNumber(7)]}"
        .modelValue="${5}"
        label="MinNumber"
      ></lion-input-amount>
      <lion-input-amount
        .validators="${[new MaxNumber(7)]}"
        .modelValue="${9}"
        label="MaxNumber"
      ></lion-input-amount>
      <lion-input-amount
        .validators="${[new MinMaxNumber({ min: 10, max: 20 })]}"
        .modelValue="${5}"
        label="MinMaxNumber"
      ></lion-input-amount>
    `,
  )
  .add('Date Validators', () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    const yesterday = new Date(year, month, day - 1);
    const tomorrow = new Date(year, month, day + 1);

    return html`
      <lion-input-date
        .validators="${[new IsDate()]}"
        .modelValue="${'foo'}"
        label="IsDate"
      ></lion-input-date>
      <lion-input-date
        .validators="${[new MinDate(today)]}"
        .modelValue="${new Date(yesterday)}"
        label="MinDate"
      ></lion-input-date>
      <lion-input-date
        .validators="${[new MaxDate(today)]}"
        .modelValue="${new Date(tomorrow)}"
        label="MaxDate"
      ></lion-input-date>
      <lion-input-date
        .validators="${[new MinMaxDate({ min: new Date(yesterday), max: new Date(tomorrow) })]}"
        .modelValue="${new Date(today)}"
        label="MinMaxDate"
      ></lion-input-date>
    `;
  })
  .add(
    'Email Validator',
    () => html`
      <lion-input-email
        .validators="${[new IsEmail()]}"
        .modelValue="${'foo'}"
        label="IsEmail"
      ></lion-input-email>
    `,
  )
  .add(
    'Validation Types',
    () => html`
      <style>
        lion-input[has-error] input {
          outline: 2px solid red;
        }
        lion-validation-feedback[type='success'] {
          color: green;
        }
        lion-validation-feedback[type='error'] {
          color: red;
        }
        lion-validation-feedback[type='warning'] {
          color: orange;
        }
        lion-validation-feedback[type='info'] {
          color: blue;
        }
      </style>
      <lion-input
        .validators="${[
          new Required(),
          new MinLength(7, { type: 'warning' }),
          new MaxLength(10, {
            type: 'info',
            getMessage: () => `Please, keep the length below the 10 characters.`,
          }),
          new DefaultSuccess(),
        ]}"
        .modelValue="${'exactly'}"
        label="Validation Types"
      ></lion-input>
    `,
  )
  .add('Custom Validator', () => {
    class MyValidator extends Validator {
      constructor(...args) {
        super(...args);
        this.name = 'myValidator';
      }

      execute(modelValue, param) {
        return modelValue !== param;
      }

      static getMessage({ fieldName, modelValue, validatorParams: param }) {
        if (modelValue.length >= param.length - 1 && param.startsWith(modelValue)) {
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
  .add(
    'Override default messages',
    () => html`
      <lion-input
        .validators="${[new EqualsLength(4, { getMessage: () => '4 chars please...' })]}"
        .modelValue="${'123'}"
        label="Custom message for validator instance"
      ></lion-input>
      <lion-input
        .validators="${[
          new EqualsLength(4, {
            getMessage: ({ modelValue, validatorParams: param }) => {
              const diff = modelValue.length - param;
              return `${Math.abs(diff)} too ${diff > 0 ? 'much' : 'few'}...`;
            },
          }),
        ]}"
        .modelValue="${'way too much'}"
        label="Dynamic message for validator instance"
      ></lion-input>
    `,
  )
  .add('Asynchronous validation', () => {
    function pause(ms = 0) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    class AsyncValidator extends Validator {
      constructor(...args) {
        super(...args);
        this.name = 'asyncValidator';
        this.async = true;
      }

      async execute() {
        console.log('async pending...');
        await pause(2000);
        console.log('async done...');
        return true;
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
  .add('Dynamic parameter changes', () => {
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
