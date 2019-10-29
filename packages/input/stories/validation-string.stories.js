import { storiesOf, html } from '@open-wc/demoing-storybook';
import {
  Required, EqualsLength, MinDate, MinLength, MaxLength, MinMaxLength, IsEmail,
  Validator,
  loadDefaultFeedbackMessages,
} from '@lion/validate';
// import { LocalizeMixin } from '@lion/localize';
import '@lion/input-date/lion-input-date.js';
// import { aTimeout } from '@open-wc/testing';
import { LionInput } from '../index.js';
import '@lion/input/lion-input.js';
import { DefaultSuccess } from '@lion/validate/src/resultValidators/DefaultSuccess';

loadDefaultFeedbackMessages();

storiesOf('Forms|Input String Validation', module)
  // .add(
  //   'isEmail',
  //   () => html`
  //     <lion-input
  //       .validators=${[IsEmail]}
  //       .modelValue=${'foo@bar.com'}
  //       label="IsEmailValidator"
  //     ></lion-input>
  //   `,
  // )
  .add('String Validators', () => html`
      <lion-input
        .validators="${[new EqualsLength(7)]}"
        .modelValue="${'not exactly'}"
        label="EqualsLength"
      ></lion-input>
      <lion-input
        .validators="${[new MaxLength(7)]}"
        .modelValue="${'exactly'}"
        label="MaxLength"
      ></lion-input>

      <lion-input
        .validators=${[new MinLength(10)]}
        .modelValue=${'too short'}
        label="MinLength"
      ></lion-input>
      <lion-input
        .validators=${[new MinMaxLength(10, 20)]}
        .modelValue=${'that should be enough'}
        label="MinMaxLength"
      ></lion-input>
    `,
  )
  // TODO: add Number validators
  // TODO: fix input-date and add Date Validators
  .add('Types', () => html`
    <style>
      lion-input[has-success] input {
        outline: 2px solid green;
      }
      lion-input[has-error] input {
        outline: 2px solid red;
      }
      lion-input[has-warning] input {
        outline: 2px solid orange;
      }
    </style>
    <lion-input
      .validators="${[
        new Required(),
        new MinLength(7, { type: 'warning' }),
        new MaxLength(10, { type: 'info' }),
        new DefaultSuccess(),
        ]}"
      .modelValue="${'exactly'}"
      label="MaxLength"
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
  .add('Override default messages', () => html`
      <lion-input
        .validators="${[new EqualsLength(4, { getMessage: () => '4 chars please...' })]}"
        .modelValue="${'123'}"
        label="Custom message for validator instance"
      ></lion-input>
      <lion-input
        .validators="${[new EqualsLength(4, {
          getMessage: ({ modelValue, validatorParams: param }) => {
            const diff = modelValue.length - param;
            return `${Math.abs(diff)} too ${diff > 0 ? 'much' : 'few'}...`;
          }
        })]}"
        .modelValue="${'way too much'}"
        label="Dynamic message for validator instance"
      ></lion-input>
  `)
  .add('Asynchronous validation', () => {
    function pause(ms = 0) {
      return new Promise((resolve) => {
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
