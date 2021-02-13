# Inputs >> Fieldset >> Features || 20

```js script
import { html } from '@lion/core';
import { localize } from '@lion/localize';
import { MinLength, Validator, Required } from '@lion/form-core';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';

import '@lion/input/lion-input.js';
import '@lion/fieldset/lion-fieldset.js';
```

## With Data

The fieldset's modelValue is an `Object` containing properties where the key is the `name` attribute of the field, and the value is the `modelValue` of the field.

```js preview-story
export const data = () => html`
  <lion-fieldset name="nameGroup" label="Name">
    <lion-input name="firstName" label="First Name" .modelValue=${'Foo'}></lion-input>
    <lion-input name="lastName" label="Last Name" .modelValue=${'Bar'}></lion-input>
    <button @click=${ev => console.log(ev.target.parentElement.modelValue)}>
      Log to Action Logger
    </button>
  </lion-fieldset>
`;
```

## Disabled

Disabling a fieldset disables all its child fields.
When enabling a fieldset, fields that have disabled explicitly set will stay disabled.

```js preview-story
export const disabled = () => {
  function toggleDisabled(e) {
    const fieldset = e.target.parentElement.querySelector('#fieldset');
    fieldset.disabled = !fieldset.disabled;
  }
  return html`
    <lion-fieldset name="nameGroup" label="Name" id="fieldset" disabled>
      <lion-input name="FirstName" label="First Name" .modelValue=${'Foo'}></lion-input>
      <lion-input name="LastName" label="Last Name" .modelValue=${'Bar'}></lion-input>
      <lion-fieldset name="nameGroup2" label="Name">
        <lion-input name="FirstName2" label="First Name" .modelValue=${'Foo'} disabled></lion-input>
        <lion-input name="LastName2" label="Last Name" .modelValue=${'Bar'}></lion-input>
      </lion-fieldset>
    </lion-fieldset>
    <button @click=${toggleDisabled}>Toggle disabled</button>
  `;
};
```

## Nesting fieldsets

Fieldsets can also be nested. The level of nesting will correspond one to one with the `modelValue` object.

```js preview-story
export const nestingFieldsets = () => html`
  <lion-fieldset>
    <div slot="label">Personal data</div>
    <lion-fieldset name="nameGroup" label="Name">
      <lion-input name="FirstName" label="First Name" .modelValue=${'Foo'}></lion-input>
      <lion-input name="LastName" label="Last Name" .modelValue=${'Bar'}></lion-input>
    </lion-fieldset>
    <lion-fieldset name="location" label="Location">
      <lion-input name="country" label="Country" .modelValue=${'Netherlands'}></lion-input>
    </lion-fieldset>
    <lion-input name="age" label="Age" .modelValue=${21}></lion-input>
    <button @click=${ev => console.log(ev.target.parentElement.modelValue)}>
      Log everything to Action Logger
    </button>
    <br />
    <button @click=${ev => console.log(ev.target.parentElement.formElements.nameGroup.modelValue)}>
      Log only Name fieldset to Action Logger
    </button>
  </lion-fieldset>
`;
```

## Validation

You can create validators that work on a fieldset level.
Below, we mimic a `required` validator, but on the fieldset.
Try it by typing something in the input, then removing it.

```js preview-story
export const validation = () => {
  const DemoValidator = class extends Validator {
    static get validatorName() {
      return 'DemoValidator';
    }
    execute(value) {
      if (value && value.input1) {
        return false; // el.hasError = true
      }
      return true;
    }
    static async getMessage() {
      return '[Fieldset Error] Demo error message';
    }
  };
  return html`
    <lion-fieldset id="someId" .validators="${[new DemoValidator()]}">
      <lion-input name="input1" label="Label"></lion-input>
    </lion-fieldset>
  `;
};
```

### Validating multiple inputs in a fieldset

You can have your fieldset validator take into consideration multiple fields.

```js preview-story
export const validatingMultipleFields = () => {
  const IsCatsAndDogs = class extends Validator {
    static get validatorName() {
      return 'IsCatsAndDogs';
    }
    execute(value) {
      return !(value.input1 === 'cats' && value.input2 === 'dogs');
    }
    static async getMessage() {
      return '[Fieldset Error] Input 1 needs to be "cats" and Input 2 needs to be "dogs"';
    }
  };
  return html`
    <lion-fieldset .validators="${[new IsCatsAndDogs()]}">
      <lion-input label="An all time YouTube favorite" name="input1" help-text="cats"> </lion-input>
      <lion-input label="Another all time YouTube favorite" name="input2" help-text="dogs">
      </lion-input>
    </lion-fieldset>
  `;
};
```

Alternatively you can also let the fieldset validator be dependent on the error states of its child fields.

Simply loop over the formElements inside your Validator's `execute` method:

```js
this.formElements.some(el => el.hasFeedbackFor.includes('error'));
```

### Validating multiple fieldsets

You can have your fieldset validator take into accounts multiple nested fieldsets.

```js preview-story
export const validatingMultipleFieldsets = () => {
  const IsCatsDogs = class extends Validator {
    static get validatorName() {
      return 'IsCatsAndDogs';
    }
    execute(value) {
      if (
        value.inner1 &&
        value.inner1.input1 === 'cats' &&
        value.inner2 &&
        value.inner2.input1 === 'dogs'
      ) {
        return false;
      }
      return true;
    }
    static async getMessage() {
      return 'There is a problem with one of your fieldsets';
    }
  };
  return html`
    <lion-fieldset name="outer" .validators=${[new IsCatsDogs()]}>
      <lion-fieldset name="inner1">
        <label slot="label">Fieldset no. 1</label>
        <lion-input label="Write 'cats' here" name="input1"> </lion-input>
      </lion-fieldset>
      <hr />
      <lion-fieldset name="inner2">
        <label slot="label">Fieldset no. 2</label>
        <lion-input label="Write 'dogs' here" name="input1"> </lion-input>
      </lion-fieldset>
    </lion-fieldset>
  `;
};
```
