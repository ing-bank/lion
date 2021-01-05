[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Validation examples

## Required Validator

The required validator can be put onto every form field element and will make sure that element is
not empty.
For an input that may mean that it is not an empty string,
while for a checkbox group it means at least one checkbox needs to be checked.

```js script
import { html } from 'lit-html';
/* eslint-disable import/no-extraneous-dependencies */
import { LionInput } from '@lion/input';
import '@lion/input-amount/lion-input-amount.js';
import '@lion/input-date/lion-input-date.js';
import '@lion/input-email/lion-input-email.js';
import '@lion/input/lion-input.js';
import {
  DefaultSuccess,
  EqualsLength,
  IsDate,
  IsEmail,
  IsNumber,
  MaxDate,
  MaxLength,
  MaxNumber,
  MinDate,
  MinLength,
  MinMaxDate,
  MinMaxLength,
  MinMaxNumber,
  MinNumber,
  Required,
  Validator,
  Pattern,
} from '@lion/form-core';

import { loadDefaultFeedbackMessages } from '@lion/validate-messages';

export default {
  title: 'Forms/Validation/Examples',
};

loadDefaultFeedbackMessages();
```

```js preview-story
export const requiredValidator = () => html`
  <lion-input .validators=${[new Required()]} label="Required"></lion-input>
`;
```

## String Validators

Useful on input elements it allows to define how many characters can be entered.

```js preview-story
export const stringValidators = () => html`
  <lion-input .validators=${[new EqualsLength(7)]} label="EqualsLength"></lion-input>
  <lion-input
    .validators=${[new MinLength(10)]}
    .modelValue=${'too short'}
    label="MinLength"
  ></lion-input>
  <lion-input
    .validators=${[new MaxLength(7)]}
    .modelValue=${'too long'}
    label="MaxLength"
  ></lion-input>
  <lion-input
    .validators=${[new MinMaxLength({ min: 10, max: 20 })]}
    .modelValue=${'that should be enough'}
    label="MinMaxLength"
  ></lion-input>
  <lion-input
    .validators=${[new Pattern(/#LionRocks/)]}
    .modelValue=${'regex checks if "#Lion<NO SPACE>Rocks" is in this input #LionRocks'}
    label="Pattern"
  ></lion-input>
`;
```

## Number Validators

Number validations assume that it's modelValue is actually a number.
Therefore it may only be used on input that have an appropriate parser/formatter like the input-amount.

```js preview-story
export const numberValidators = () => html`
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
`;
```

## Date Validators

Date validators work with real javascript dates. Use them on input-date.

```js preview-story
export const dateValidators = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  const yesterday = new Date(year, month, day - 1);
  const tomorrow = new Date(year, month, day + 1);
  return html`
    <lion-input-date
      .validators=${[new IsDate()]}
      .modelValue=${'foo'}
      label="IsDate"
    ></lion-input-date>
    <lion-input-date
      .validators=${[new MinDate(today)]}
      .modelValue=${new Date(yesterday)}
      label="MinDate"
    ></lion-input-date>
    <lion-input-date
      .validators=${[new MaxDate(today)]}
      .modelValue=${new Date(tomorrow)}
      label="MaxDate"
    ></lion-input-date>
    <lion-input-date
      .validators=${[new MinMaxDate({ min: new Date(yesterday), max: new Date(tomorrow) })]}
      .modelValue=${new Date(today)}
      label="MinMaxDate"
    ></lion-input-date>
  `;
};
```

## Email Validator

```js preview-story
export const emailValidator = () => html`
  <lion-input-email
    .validators="${[new IsEmail()]}"
    .modelValue="${'foo'}"
    label="IsEmail"
  ></lion-input-email>
`;
```

## Validation Types

When defining your own component you can decide to allow for multiple types of validation.
By default only `error` is used, however there are certainly use cases where warning or success messages make sense.

```js preview-story
export const validationTypes = () => {
  try {
    class MyTypesInput extends LionInput {
      static get validationTypes() {
        return ['error', 'warning', 'info', 'success'];
      }
    }
    customElements.define('my-types-input', MyTypesInput);
  } catch (err) {
    // expected as it is a demo
  }
  return html`
    <style>
      .demo-types-input {
        padding: 0.5rem;
      }
      .demo-types-input[shows-feedback-for~='success'] {
        background-color: #e4ffe4;
        border: 1px solid green;
      }
      .demo-types-input[shows-feedback-for~='error'] {
        background-color: #ffd4d4;
        border: 1px solid red;
      }
      .demo-types-input[shows-feedback-for~='warning'] {
        background-color: #ffe4d4;
        border: 1px solid orange;
      }
      .demo-types-input[shows-feedback-for~='info'] {
        background-color: #d4e4ff;
        border: 1px solid blue;
      }
    </style>
    <my-types-input
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
      class="demo-types-input"
    ></my-types-input>
  `;
};
```

## Custom Validators

Here is an example how you can make your own validator and providing the error messages directly within.
You can even hard code localization in there if needed or you can use a localization system.

```js preview-story
export const customValidators = () => {
  class MyValidator extends Validator {
    static get validatorName() {
      return 'myValidator';
    }
    execute(modelValue, param) {
      return modelValue !== param;
    }
    static getMessage({ fieldName, modelValue, params: param }) {
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
};
```

## Default messages

To get default validation messages you need to import and call the `loadDefaultFeedbackMessages` function once in your application.

Sometimes the default messages don't make sense for your input field. In that case you want to override it by adding a `getMessage` function to your validator.

```js preview-story
export const defaultMessages = () => html`
  <lion-input
    .validators="${[new EqualsLength(4, { getMessage: () => '4 chars please...' })]}"
    .modelValue="${'123'}"
    label="Custom message for validator instance"
  ></lion-input>
  <lion-input
    .validators="${[
      new EqualsLength(4, {
        getMessage: ({ modelValue, params: param }) => {
          const diff = modelValue.length - param;
          return `${Math.abs(diff)} too ${diff > 0 ? 'much' : 'few'}...`;
        },
      }),
    ]}"
    .modelValue="${'way too much'}"
    label="Dynamic message for validator instance"
  ></lion-input>
`;
```

## Override fieldName

In the scenario that the default messages are correct, but you only want to change the `fieldName`, this can both be done for a single specific validator or for all at once.

```js preview-story
export const overrideFieldName = () => html`
  <lion-input
    .validators="${[new EqualsLength(4, { fieldName: 'custom fieldName' })]}"
    .modelValue="${'123'}"
    label="Custom fieldName for 1 validator"
  ></lion-input>
  <lion-input
    .validators="${[new Required(), new EqualsLength(4)]}"
    .fieldName="${'custom fieldName'}"
    .modelValue="${'123'}"
    label="Custom fieldName for all validators"
  ></lion-input>
`;
```

## Asynchronous validation

```js preview-story
export const asynchronousValidation = () => {
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
    }
    static get validatorName() {
      return 'asyncValidator';
    }
    static get async() {
      return true;
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
};
```

## Dynamic parameter change

```js preview-story
export const dynamicParameterChange = () => {
  const beginDate = new Date('09/09/1990');
  const minDateValidatorRef = new MinDate(beginDate, {
    message: 'Fill in a date after your birth date',
  });
  return html`
    <lion-input-date
      label="Birth date"
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
      label="Graduation date"
      .modelValue="${new Date('09/09/1989')}"
      .validators="${[minDateValidatorRef]}"
    ></lion-input-date>
  `;
};
```

## Disabled inputs validation

According to the W3C specs, Disabled fields should not be validated.
Therefor if the attribute disabled is present on a lion-input it will not be validated.

```js preview-story
export const disabledInputsValidation = () => html`
  <lion-input
    disabled
    .validators=${[new EqualsLength(7)]}
    .modelValue=${'not exactly'}
    label="EqualsLength"
  ></lion-input>
  <lion-input
    disabled
    .validators=${[new MinLength(10)]}
    .modelValue=${'too short'}
    label="MinLength"
  ></lion-input>
  <lion-input
    disabled
    .validators=${[new MaxLength(7)]}
    .modelValue=${'too long'}
    label="MaxLength"
  ></lion-input>
  <lion-input
    disabled
    .validators=${[new MinMaxLength({ min: 10, max: 20 })]}
    .modelValue=${'that should be enough'}
    label="MinMaxLength"
  ></lion-input>
`;
```

### Form Validation Reset

```js preview-story
export const FormValidationReset = () => html`
  <lion-form id="wideRightLayout" responsive>
    <form>
      <lion-input
        name="first_name"
        label="First Name"
        .validators="${[new Required()]}"
      ></lion-input>
      <lion-input name="last_name" label="Last Name" .validators="${[new Required()]}"></lion-input>
      <lion-input-date
        name="start-date"
        label="Start date"
        .modelValue="${new Date('2000-12-12')}"
        .validators="${[new Required()]}"
      ></lion-input-date>
      <lion-input-datepicker
        name="end-date"
        label="End date"
        .modelValue="${new Date()}"
        .validators="${[new Required()]}"
      ></lion-input-datepicker>
      <lion-textarea
        name="bio"
        label="Biography"
        .validators="${[new Required(), new MinLength(10)]}"
        help-text="Please enter at least 10 characters"
      ></lion-textarea>
      <lion-input-amount name="money" label="Money"></lion-input-amount>
      <lion-input-iban name="iban" label="Iban"></lion-input-iban>
      <lion-input-email name="email" label="Email"></lion-input-email>
      <lion-checkbox-group
        label="What do you like?"
        name="checkers[]"
        .validators="${[new Required()]}"
      >
        <lion-checkbox .choiceValue=${'foo'} label="I like foo"></lion-checkbox>
        <lion-checkbox .choiceValue=${'bar'} label="I like bar"></lion-checkbox>
        <lion-checkbox .choiceValue=${'baz'} label="I like baz"></lion-checkbox>
      </lion-checkbox-group>
      <lion-radio-group
        name="dinosaurs"
        label="Favorite dinosaur"
        .validators="${[new Required()]}"
      >
        <lion-radio .choiceValue=${'allosaurus'} label="allosaurus"></lion-radio>
        <lion-radio .choiceValue=${'brontosaurus'} label="brontosaurus"></lion-radio>
        <lion-radio .choiceValue=${'diplodocus'} label="diplodocus"></lion-radio>
      </lion-radio-group>
      <lion-select label="Lyrics" name="lyrics" .validators="${[new Required()]}">
        <select slot="input">
          <option value="1">Fire up that loud</option>
          <option value="2">Another round of shots...</option>
          <option value="3">Drop down for what?</option>
        </select>
      </lion-select>
      <lion-input-range
        name="range"
        min="1"
        max="5"
        .modelValue="${2.3}"
        unit="%"
        step="0.1"
        label="Input range"
      ></lion-input-range>
      <lion-checkbox-group
        name="terms[]"
        .validators="${[
          new Required(null, { getMessage: () => 'You are not allowed to read them' }),
        ]}"
      >
        <lion-checkbox label="I blindly accept all terms and conditions"></lion-checkbox>
      </lion-checkbox-group>
      <lion-switch
        name="notifications"
        label="Notifications"
        help-text="Flip the switch to turn notifications on"
      ></lion-switch>
      <lion-textarea name="comments" label="Comments"></lion-textarea>
      <div class="buttons">
        <lion-button raised>Submit</lion-button>
        <lion-button
          type="button"
          raised
          @click=${ev => {
            console.log(ev.currentTarget.parentElement.parentElement.parentElement);
            ev.currentTarget.parentElement.parentElement.parentElement.resetGroup();
          }}
          >Reset</lion-button
        >
      </div>
    </form>
  </lion-form>
`;
```
