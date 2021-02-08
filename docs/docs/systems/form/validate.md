# Systems >> Form >> Validate || 30

```js script
import { html } from '@lion/core';
import { LionInput } from '@lion/input';
import '@lion/checkbox-group/lion-checkbox-group.js';
import '@lion/checkbox-group/lion-checkbox.js';
import '@lion/combobox/lion-combobox.js';
import '@lion/fieldset/lion-fieldset.js';
import '@lion/form/lion-form.js';
import '@lion/input-amount/lion-input-amount.js';
import '@lion/input-date/lion-input-date.js';
import '@lion/input-datepicker/lion-input-datepicker.js';
import '@lion/input-email/lion-input-email.js';
import '@lion/input-iban/lion-input-iban.js';
import '@lion/input-range/lion-input-range.js';
import '@lion/input-stepper/lion-input-stepper.js';
import '@lion/input/lion-input.js';
import '@lion/listbox/lion-listbox.js';
import '@lion/listbox/lion-option.js';
import '@lion/listbox/lion-options.js';
import '@lion/radio-group/lion-radio-group.js';
import '@lion/radio-group/lion-radio.js';
import '@lion/select/lion-select.js';
import '@lion/select-rich/lion-select-rich.js';
import '@lion/textarea/lion-textarea.js';
import {
  DefaultSuccess,
  EqualsLength,
  IsDate,
  IsEmail,
  IsNumber,
  IsString,
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
import { localize } from '@lion/localize';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';
```

## When validation happens

Validation happens on every change of `modelValue`. A change in modelValue can be originated from either user interaction or an imperative action from an Application Developer. We could therefore say validation happens 'realtime'. This is aligned with the platform.

## When validation feedback will be shown

Although validation happens realtime under the hood, displaying validity feedback in realtime may not always lead to the desired User Experience. Together with [interaction states](/docs/systems/form/interaction-states/),
validity states can determine whether a validation message should be shown along the input field.

## Assessing field validation state programmatically

When a field has validation feedback it can be accessed using the `hasFeedbackFor` and `showsFeedbackFor` properties. This can be used if the validity of the field is needed in code.

- `hasFeedbackFor` is the state of the field regardless of whether the feedback is shown or not.
- `showsFeedbackFor` represents whether or not validation feedback is being shown. This takes into account interaction state such as a field being `touched` and `dirty`, `prefilled` or `submitted`

```js
// Field is invalid and has not interacted with
const field = document.querySelector('#my-field');
field.hasFeedbackFor.includes('error'); // returns true
field.showsFeedbackFor.includes('error'); // returns false

// Field  invalid, dirty and touched
field.hasFeedbackFor.includes('error'); // returns true
field.showsFeedbackFor.includes('error'); // returns true
```

## Features

- Allow for advanced UX scenarios by updating validation state on every value change
- Provide a powerful way of writing validation via pure functions
- Default validators
- Custom validators
- Multiple validation types(error, warning, info, success)

Our validation system is designed to:

- Allow for advanced UX scenarios by updating validation state on every value change
- Provide a powerful way of writing validations via classes.

## Validators

All validators are extensions of the `Validator` class. They should be applied to the element implementing `ValidateMixin` as follows:

```html
<validatable-el
  .validators="${[new MyValidator({ myParam: 'foo' }), { extra: 'options' } ]]}"
></validatable-el>
```

As you can see the 'validators' property expects a map (an array of arrays). So, every Validator is a class consisting of:

- validator function
- validator parameters (optional)
- validator config (optional)

### Validator classes

All validators extend from the default `Validator` class. Below example is an example of a validator could look like:

```js
class MyValidator extends Validator {
  execute(modelValue, param) {
    const hasFeedback = false;
    if (modelValue === param) {
      hasFeedback = true;
    }
    return hasFeedback;
  }

  static get validatorName() {
    return 'Required';
  }

  static getMessage({ fieldName }) {
    return `Please fill in ${fieldName}`;
  }
}
```

```html
<validatable-el .validators="${[new MyValidator('foo')]}"></validatable-el>
```

## How to use

### Installation

```bash
npm i --save @lion/form-core
```

```js
import '@lion/input/lion-input.js';
import { %ValidatorName% } from '@lion/form-core';
```

## Default Validators

By default, the validate system ships with the following validators:

- **Required**
- **String Validators**, IsString, EqualsLength, MinLength, MaxLength, MinMaxLength, Pattern
- **Number Validators**, IsNumber, MinNumber, MaxNumber, MinMaxNumber
- **Date Validators**, IsDate, MinDate, MaxDate, MinMaxDate, IsDateDisabled
- **Email Validator**, IsEmail

All validators return `false` if the required validity state is met.

All validators are considered self explanatory due to their explicit namings.

```bash
npm i --save @lion/validate-messages
```

```js
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';
```

```js preview-story
export const defaultValidationMessages = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input
      name="value"
      label="Default validation"
      .fieldName="${'value'}"
      .validators="${[new Required(), new MinLength(4)]}"
      .modelValue="${'foo'}"
    ></lion-input>
    <button @click=${() => (localize.locale = 'de-DE')}>DE</button>
    <button @click=${() => (localize.locale = 'en-GB')}>EN</button>
    <button @click=${() => (localize.locale = 'fr-FR')}>FR</button>
    <button @click=${() => (localize.locale = 'nl-NL')}>NL</button>
    <button @click=${() => (localize.locale = 'zh-CN')}>CN</button>
  `;
};
```

Once the method `loadDefaultFeedbackMessages` is called, it will make sure that all validators provided in `@lion/form-core` will have a default error message. It uses the `@lion/localize` system to provide these translations and has support for more than 15 locales.

### Required

The required validator can be put onto every form field element and will make sure that element is not empty. For an input that may mean that it is not an empty string, while for a `checkbox-group` it means at least one `checkbox` needs to be checked.

```js preview-story
export const requiredValidator = () => html`
  <lion-input .validators=${[new Required()]} label="Required"></lion-input>
`;
```

### String Validators

Useful on input elements it allows to define how many characters can be entered.

```js preview-story
export const stringValidators = () => html`
  <lion-input
    .validators=${[new EqualsLength(7)]}
    .modelValue=${'not exactly'}
    label="EqualsLength"
  ></lion-input>
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

### Number Validators

Number validations assume that it's modelValue is actually a number.
Therefore it may only be used on input that have an appropriate parser/formatter like the `input-amount`.

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

### Date Validators

Date validators work with real javascript dates. Use them on `input-date` or `input-datepicker`.

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

### Email Validator

```js preview-story
export const emailValidator = () => html`
  <lion-input-email
    .validators="${[new IsEmail()]}"
    .modelValue="${'foo'}"
    label="IsEmail"
  ></lion-input-email>
`;
```

### Override Default Messages

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

### Override fieldName

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

## Custom Validators

Here is an example how you can make your own validator and providing the error messages directly within. You can even hard code localization in there if needed or you can use a localization system.

> Note that we import an `lion-input` here as an example of a form control implementing `ValidateMixin`.
> We could equally well use `lion-textarea`, `lion-select`, `lion-fieldset` etc. to illustrate our example.

```js preview-story
export const customValidators = () => {
  const isInitialsRegex = /^([A-Z]\.)+$/;
  class IsInitialsExample extends Validator {
    static get validatorName() {
      return 'IsExampleInitials';
    }

    execute(value) {
      let hasFeedback = false;
      const isStringValidator = new IsString();
      if (isStringValidator.execute(value) || !isInitialsRegex.test(value)) {
        hasFeedback = true;
      }
      return hasFeedback;
    }

    static getMessage({ fieldName }) {
      return `Please enter a valid ${fieldName} in the format "L.I.".`;
    }
  }
  return html`
    <lion-input
      label="Initials"
      name="initials"
      .validators="${[new IsInitialsExample('mine')]}"
    ></lion-input>
  `;
};
```

The custom `IsInitialsExample` checks if the value is fitting our regex, but does not prevent the user from submitting other values.

Retrieving validity states is as easy as checking for:

```js
myInitialsInput.hasFeedbackFor.include('error');
```

## Validation Examples

### Checkbox Validator

You can apply validation to the `<lion-checkbox-group>`, similar to how you would do so in any fieldset. The interaction states of the `<lion-checkbox-group>` are evaluated in order to hide or show feedback messages.

```js preview-story
export const checkboxValidation = () => {
  const validate = e => {
    const checkboxGroup = e.target.parentElement.querySelector('#scientists');
    checkboxGroup.submitted = !checkboxGroup.submitted;
  };
  return html`
    <lion-checkbox-group
      id="scientists"
      name="scientists[]"
      label="Favorite scientists"
      .validators=${[new Required()]}
    >
      <lion-checkbox label="Archimedes" .choiceValue=${'Archimedes'}></lion-checkbox>
      <lion-checkbox label="Francis Bacon" .choiceValue=${'Francis Bacon'}></lion-checkbox>
      <lion-checkbox label="Marie Curie" .choiceValue=${'Marie Curie'}></lion-checkbox>
    </lion-checkbox-group>
    <button @click="${e => validate(e)}">Validate</button>
  `;
};
```

Below is a more advanced validator on the group that evaluates the children checkboxes' checked states.

```js preview-story
export const checkboxValidationAdvanced = () => {
  class HasMinTwoChecked extends Validator {
    execute(value) {
      return value.length < 2;
    }
    static get validatorName() {
      return 'HasMinTwoChecked';
    }
    static async getMessage() {
      return 'You need to select at least 2 values.';
    }
  }
  const validate = e => {
    const checkboxGroup = e.target.parentElement.querySelector('#scientists2');
    checkboxGroup.submitted = !checkboxGroup.submitted;
  };
  return html`
    <lion-checkbox-group
      id="scientists2"
      name="scientists2[]"
      label="Favorite scientists"
      help-text="You should have at least 2 of those"
      .validators=${[new Required(), new HasMinTwoChecked()]}
    >
      <lion-checkbox label="Archimedes" .choiceValue=${'Archimedes'}></lion-checkbox>
      <lion-checkbox label="Francis Bacon" .choiceValue=${'Francis Bacon'}></lion-checkbox>
      <lion-checkbox label="Marie Curie" .choiceValue=${'Marie Curie'}></lion-checkbox>
    </lion-checkbox-group>
    <button @click="${e => validate(e)}">Validate</button>
  `;
};
```

### Radio Validator

```js preview-story
export const radioValidation = () => {
  const validate = e => {
    const radioGroup = e.target.parentElement.querySelector('#dinos1');
    radioGroup.submitted = !radioGroup.submitted;
  };
  return html`
    <lion-radio-group
      id="dinos1"
      name="dinos1"
      label="Favourite dinosaur"
      .validators=${[new Required()]}
    >
      <lion-radio label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
      <lion-radio label="brontosaurus" .choiceValue=${'brontosaurus'}></lion-radio>
      <lion-radio label="diplodocus" .choiceValue="${'diplodocus'}"></lion-radio>
    </lion-radio-group>
    <button @click="${e => validate(e)}">Validate</button>
  `;
};
```

You can also create a validator that validates whether a certain option is checked.

```js preview-story
export const radioValidationAdvanced = () => {
  class IsBrontosaurus extends Validator {
    static get validatorName() {
      return 'IsBrontosaurus';
    }
    execute(value) {
      let showFeedback = false;
      if (value !== 'brontosaurus') {
        showFeedback = true;
      }
      return showFeedback;
    }
    static async getMessage() {
      return 'You need to select "brontosaurus"';
    }
  }
  const validate = e => {
    const radioGroup = e.target.parentElement.querySelector('#dinos2');
    radioGroup.submitted = !radioGroup.submitted;
  };
  return html`
    <lion-radio-group
      id="dinos2"
      name="dinos2"
      label="Favourite dinosaur"
      .validators=${[new Required(), new IsBrontosaurus()]}
    >
      <lion-radio label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
      <lion-radio label="brontosaurus" .choiceValue=${'brontosaurus'}></lion-radio>
      <lion-radio label="diplodocus" .choiceValue=${'diplodocus'}></lion-radio>
    </lion-radio-group>
    <button @click="${e => validate(e)}">Validate</button>
  `;
};
```

### Combobox

Validation can be used as normal, below is an example of a combobox with a `Required` validator.

```js preview-story
export const validationCombobox = () => html`
  <lion-combobox .validators="${[new Required()]}" name="favoriteMovie" label="Favorite movie">
    <lion-option checked .choiceValue=${'Rocky'}>Rocky</lion-option>
    <lion-option .choiceValue=${'Rocky II'}>Rocky II</lion-option>
    <lion-option .choiceValue=${'Rocky III'}>Rocky III</lion-option>
    <lion-option .choiceValue=${'Rocky IV'}>Rocky IV</lion-option>
    <lion-option .choiceValue=${'Rocky V'}>Rocky V</lion-option>
    <lion-option .choiceValue=${'Rocky Balboa'}>Rocky Balboa</lion-option>
  </lion-combobox>
`;
```

## Validation Types

The most common use case for validation is the assessment of whether the input is in error state. An error state would be considered blocking: it prevents a form from being submitted to the server.

However, the validation system also supports three non blocking validation feedback types. Summed up, we have the following four types:

- **error**: blocking the field from being submitted to the server. For example:
  "Please enter an amount higher than 1000,00 euro."
- **warning**: something looks wrong, but it is not blocking. For example an optional email input:
  "Please enter a valid e-mail address in the format "name@example.com"."
- **info**: shows extra information. For example a message of a scheduled payment planner:
  "Ends on 15/05/2020 after 5 payments."
- **success**: will only be triggered if there was a Message from one of the above validation types and is now correct. For example: "Ok, correct."

The api for warning validators and info validators are as follows:

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

Success validators work a bit differently. Their success state is defined by the lack of a previously existing erroneous state (which can be an error or warning state).

So, an error validator going from invalid (true) state to invalid(false) state, will trigger the success validator.

## Asynchronous validation

By default, all validations are run synchronously. However, for instance when validation can only take place on server level, asynchronous validation will be needed.

You can make your async validators as follows:

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

According to the W3C specs, Disabled fields should not be validated. Therefore if the attribute disabled is present on a `lion-input` it will not be validated.

```js preview-story
export const disabledInputsValidation = () => html`
  <lion-input
    disabled
    .validators=${[new EqualsLength(7)]}
    .modelValue=${'not exactly'}
    label="EqualsLength"
  ></lion-input>
`;
```
