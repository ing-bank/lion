# Radio-group

`lion-radio-group` component is webcomponent that enhances the functionality of the native `<input type="radio">` element. Its purpose is to provide a way for users to check a **single** option amongst a set of choices.

You should use `<lion-radio>`s inside this element.

```js script
import { html } from '@lion/core';
import { Required, Validator } from '@lion/form-core';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';

import './lion-radio-group.js';
import './lion-radio.js';

export default {
  title: 'Forms/Radio Group',
};

loadDefaultFeedbackMessages();
```

```js preview-story
export const main = () => html`
  <lion-radio-group name="dinos" label="What are your favourite dinosaurs?">
    <lion-radio label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue=${'brontosaurus'}></lion-radio>
    <lion-radio label="diplodocus" .choiceValue=${'diplodocus'}></lion-radio>
  </lion-radio-group>
`;
```

- Make sure that to use a name attribute as it is necessary for the [lion-form](?path=/docs/forms-form-overview--main#form)'s serialization result.
- If you have many options for a user to pick from, consider using [lion-select](?path=/docs/forms-select--main#select) instead

## Features

Since it extends from [lion-fieldset](?path=/docs/forms-fieldset-overview--main#fieldset), it has all the features a fieldset has.

- Get or set the checked value of the group:
  - modelValue (default) - `checkedValue()`
  - formattedValue - `formattedValue()`
  - serializedValue - `serializedValue()`

## How to use

### Installation

```bash
npm i --save @lion/radio-group
```

```js
import { LionRadioGroup, LionRadio } from '@lion/radio-group';
// or
import '@lion/radio-group/lion-radio-group.js';
import '@lion/radio-group/lion-radio.js';
```

### Model value

The `modelValue` of a `lion-radio-group` is string equal to the `choiceValue` of the `lion-radio` element that has been checked.

Given the dinosaur example above, say that we were to select the last option (diplodocus).

Then the `modelValue` of the `lion-radio-group` will look as follows:

```js
const groupElement = [parent].querySelector('lion-radio-group');
groupElement.modelValue;
  => "diplodocus";
```

### The `name` attribute

The `name` attribute of a `lion-radio-group` automatically gets assigned to its `lion-radio` children. You can also specify names for the `lion-radio` elements, but if this name is different from the name assigned to `lion-radio-group`, then an exception will be thrown.

Our recommendation would be to set the `name` attribute only on the `lion-radio-group` and not on the `lion-checkbox` elements.

## Examples

### Pre-select

You can pre-select an option by adding the checked attribute to the selected `lion-radio`.

```js preview-story
export const preSelect = () => html`
  <lion-radio-group name="dinos_2" label="What are your favourite dinosaurs?">
    <lion-radio label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue=${'brontosaurus'} checked></lion-radio>
    <lion-radio label="diplodocus" .choiceValue=${'diplodocus'}></lion-radio>
  </lion-radio-group>
`;
```

### Disabled

You can disable a specific `lion-radio` option by adding the `disabled` attribute.

```js preview-story
export const disabledRadio = () => html`
  <lion-radio-group name="dinos_4" label="What are your favourite dinosaurs?">
    <lion-radio label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue=${'brontosaurus'} disabled></lion-radio>
    <lion-radio label="diplodocus" .choiceValue=${'diplodocus'}></lion-radio>
  </lion-radio-group>
`;
```

You can do the same thing for the entire group by setting the `disabled` attribute on the `lion-radio-group` element.

```js preview-story
export const disabledGroup = () => html`
  <lion-radio-group name="dinos_6" label="What are your favourite dinosaurs?" disabled>
    <lion-radio label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue=${'brontosaurus'}></lion-radio>
    <lion-radio label="diplodocus" .choiceValue=${'diplodocus'}></lion-radio>
  </lion-radio-group>
`;
```

### Validation

```js preview-story
export const validation = () => {
  const validate = () => {
    const radioGroup = document.querySelector('#dinos');
    radioGroup.submitted = !radioGroup.submitted;
  };
  return html`
    <lion-radio-group
      id="dinos"
      name="dinos_8"
      label="Favourite dinosaur"
      .validators=${[new Required()]}
    >
      <lion-radio label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
      <lion-radio label="brontosaurus" .choiceValue=${'brontosaurus'}></lion-radio>
      <lion-radio label="diplodocus" .choiceValue="${'diplodocus'}"></lion-radio>
    </lion-radio-group>
    <button @click="${() => validate()}">Validate</button>
  `;
};
```

You can also create a validator that validates whether a certain option is checked.

```js preview-story
export const validateItem = () => {
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
  const validate = () => {
    const radioGroup = document.querySelector('#dinosTwo');
    radioGroup.submitted = !radioGroup.submitted;
  };
  return html`
    <lion-radio-group
      id="dinosTwo"
      name="dinosTwo"
      label="Favourite dinosaur"
      .validators=${[new Required(), new IsBrontosaurus()]}
    >
      <lion-radio label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
      <lion-radio label="brontosaurus" .choiceValue=${'brontosaurus'}></lion-radio>
      <lion-radio label="diplodocus" .choiceValue=${'diplodocus'}></lion-radio>
    </lion-radio-group>
    <button @click="${() => validate()}">Validate</button>
  `;
};
```

### Help text

You can add help text on each checkbox with `help-text` attribute on the `<lion-radio>`.

```js preview-story
export const helpText = () => html`
  <lion-radio-group name="dinosTwo" label="Favourite dinosaur">
    <lion-radio
      label="allosaurus"
      .choiceValue=${'allosaurus'}
      help-text="Allosaurus is a genus of carnivorous theropod dinosaur that lived 155 to 145 million years ago during the late Jurassic period"
    ></lion-radio>
    <lion-radio
      label="brontosaurus"
      .choiceValue=${'brontosaurus'}
      help-text="Brontosaurus is a genus of gigantic quadruped sauropod dinosaurs"
    ></lion-radio>
    <lion-radio
      label="diplodocus"
      .choiceValue=${'diplodocus'}
      help-text="Diplodocus is a genus of diplodocid sauropod dinosaurs whose fossils were first discovered in 1877 by S. W. Williston"
    ></lion-radio>
  </lion-radio-group>
`;
```

### Event

You can listen to the `model-value-changed` event whenever the value of the radio group is changed.

```js preview-story
export const event = () => html`
  <lion-radio-group
    name="dinosTwo"
    label="Favourite dinosaur"
    @model-value-changed=${e =>
      (document.getElementById('selectedDinosaur').innerText = e.target.modelValue)}
  >
    <lion-radio label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue=${'brontosaurus'}></lion-radio>
    <lion-radio label="diplodocus" .choiceValue=${'diplodocus'}></lion-radio>
  </lion-radio-group>
  <br />
  <span>Selected dinosaur: <strong id="selectedDinosaur">N/A</strong></span>
`;
```
