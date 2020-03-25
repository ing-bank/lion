[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Checkbox Group

`lion-checkbox-group` component enhances the functionality of the native `<input type="checkbox">` element.
Its purpose is to provide a way for users to check **multiple** options amongst a set of choices, or to function as a single toggle.

> You should use [lion-checkbox](https://github.com/ing-bank/lion/tree/master/packages/checkbox) elements as the children of the `<lion-checkbox-group>`.

```js script
import { html } from 'lit-html';
import { Required, Validator, loadDefaultFeedbackMessages } from '@lion/validate';
import './lion-checkbox-group.js';
import './lion-checkbox.js';

export default {
  title: 'Forms/Checkbox Group',
};

loadDefaultFeedbackMessages();
```

```js story
export const main = () => html`
  <lion-checkbox-group name="scientists[]" label="Favorite scientists">
    <lion-checkbox label="Archimedes" .choiceValue=${'Archimedes'}></lion-checkbox>
    <lion-checkbox label="Francis Bacon" .choiceValue=${'Francis Bacon'}></lion-checkbox>
    <lion-checkbox label="Marie Curie" .choiceValue=${'Marie Curie'}></lion-checkbox>
  </lion-checkbox-group>
`;
```

> Make sure that the checkbox-group also has a name attribute, this is necessary for the [lion-form](?path=/docs/forms-form-overview--page)'s serialization result.

## Live Demo/Documentation

> See our [storybook](http://lion-web-components.netlify.com/?path=/docs/forms-checkbox-group--default-story) for a live demo and API documentation

## Features

Since it extends from [lion-fieldset](?path=/docs/forms-fieldset-overview--page), it has all the features a fieldset has.

## How to use

### Installation

```sh
npm i --save @lion/checkbox-group
```

```js
import '@lion/checkbox-group/lion-checkbox-group.js';
import '@lion/checkbox-group/lion-checkbox.js';
```

### Model value

The `modelValue` of a `lion-checkbox-group` is an array containing the `choiceValues` of the `lion-checkbox` elements that have been checked.

Given the scientists example above, say that we were to select the first and last options (Archimedes & Marie Curie).

Then the `modelValue` of the `lion-checkbox-group` will look as follows:

```js
const groupElement = [parent].querySelector('lion-checkbox-group');
groupElement.modelValue;
  => ["Archimedes", "Marie Curie"];
```

### The `name` attribute

The `name` attribute of a `lion-checkbox-group` automatically gets assigned to its `lion-checkbox` children. You can also specify names for the `lion-checkbox` elements, but if this name is different from the name assigned to `lion-checkbox-group`, then an exception will be thrown.

Our recommendation would be to set the `name` attribute only on the `lion-checkbox-group` and not on the `lion-checkbox` elements.

### Example

```html
<lion-checkbox-group
  name="scientists[]"
  label="Favorite scientists"
>
  <lion-checkbox label="Archimedes" .choiceValue=${'Archimedes'}></lion-checkbox>
  <lion-checkbox label="Francis Bacon" .choiceValue=${'Francis Bacon'}></lion-checkbox>
  <lion-checkbox label="Marie Curie" .choiceValue=${'Marie Curie'}></lion-checkbox>
</lion-checkbox-group>
```

### Pre-select

You can pre-select options by targeting the `modelValue` object of the option and setting the `checked` property to `true`.

```js preview-story
export const preselect = () => html`
  <lion-checkbox-group name="scientists" label="Favorite scientists">
    <lion-checkbox label="Archimedes" .choiceValue=${'Archimedes'}></lion-checkbox>
    <lion-checkbox label="Francis Bacon" .choiceValue=${'Francis Bacon'} checked></lion-checkbox>
    <lion-checkbox
      label="Marie Curie"
      .modelValue=${{ value: 'Marie Curie', checked: true }}
    ></lion-checkbox>
  </lion-checkbox-group>
`;
```

### Disabled

You can disable the entire group by setting the `disabled` attribute on the `<lion-checkbox-group>`.

```js preview-story
export const disabled = () => html`
  <lion-checkbox-group name="scientists[]" label="Favorite scientists" disabled>
    <lion-checkbox label="Archimedes" .choiceValue=${'Archimedes'}></lion-checkbox>
    <lion-checkbox label="Francis Bacon" .choiceValue=${'Francis Bacon'}></lion-checkbox>
    <lion-checkbox
      label="Marie Curie"
      .modelValue=${{ value: 'Marie Curie', checked: true }}
    ></lion-checkbox>
  </lion-checkbox-group>
`;
```

### Validation

You can apply validation to the `<lion-checkbox-group>`, similar to how you would do so in any fieldset.
The interaction states of the `<lion-checkbox-group>` are evaluated in order to hide or show feedback messages.

```js preview-story
export const validation = () => {
  const validate = () => {
    const checkboxGroup = document.querySelector('#scientists');
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
    <button @click="${() => validate()}">Validate</button>
  `;
};
```

### Validation advanced

Below is a more advanced validator on the group that evaluates the children checkboxes' checked states.

```js preview-story
export const validationAdvanced = () => {
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
  const validate = () => {
    const checkboxGroup = document.querySelector('#scientists2');
    checkboxGroup.submitted = !checkboxGroup.submitted;
  };
  return html`
    <lion-checkbox-group
      id="scientists2"
      name="scientists[]"
      label="Favorite scientists"
      help-text="You should have at least 2 of those"
      .validators=${[new Required(), new HasMinTwoChecked()]}
    >
      <lion-checkbox label="Archimedes" .choiceValue=${'Archimedes'}></lion-checkbox>
      <lion-checkbox label="Francis Bacon" .choiceValue=${'Francis Bacon'}></lion-checkbox>
      <lion-checkbox label="Marie Curie" .choiceValue=${'Marie Curie'}></lion-checkbox>
    </lion-checkbox-group>
    <button @click="${() => validate()}">Validate</button>
  `;
};
```
