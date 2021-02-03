[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Checkbox Group

`lion-checkbox-group` component enhances the functionality of the native `<input type="checkbox">` element.
Its purpose is to provide a way for users to check **multiple** options amongst a set of choices, or to function as a single toggle.

> You should use `<lion-checkbox>` elements as the children of the `<lion-checkbox-group>`.

```js script
import { html } from '@lion/core';
import { Required, Validator } from '@lion/form-core';
import './lion-checkbox-group.js';
import './lion-checkbox-indeterminate.js';
import './lion-checkbox.js';

export default {
  title: 'Forms/Checkbox Group',
};
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

> Make sure that the checkbox-group also has a name attribute, this is necessary for the [lion-form](?path=/docs/forms-form-overview--main)'s serialization result.

## Features

Since it extends from [lion-fieldset](?path=/docs/forms-fieldset-overview--main),
it has all the features a fieldset has.

## How to use

### Installation

```bash
npm i --save @lion/checkbox-group
```

```js
import '@lion/checkbox-group/lion-checkbox-group.js';
import '@lion/checkbox-group/lion-checkbox.js';
```

### Model value

The `modelValue` of a `lion-checkbox-group` is an array containing the `choiceValues` of the `lion-checkbox` elements that have been checked.

Given the scientists example above, say that we were to select the first and last options
(Archimedes & Marie Curie).

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

### Help text

You can add help text on each checkbox with `help-text` attribute on the `<lion-checkbox>`.

```js preview-story
export const helpText = () => html`
  <lion-checkbox-group name="scientists[]" label="Favorite scientists">
    <lion-checkbox
      label="Archimedes"
      .choiceValue=${'Archimedes'}
      help-text="Archimedes of Syracuse was a Greek mathematician, physicist, engineer, inventor, and astronomer"
    ></lion-checkbox>
    <lion-checkbox
      label="Francis Bacon"
      .choiceValue=${'Francis Bacon'}
      help-text="Francis Bacon, 1st Viscount St Alban also known as Lord Verulam, was an English philosopher and statesman who served as Attorney General and as Lord Chancellor of England"
    ></lion-checkbox>
    <lion-checkbox
      label="Marie Curie"
      .choiceValue=${'Marie Curie'}
      help-text="Marie Skłodowska Curie born Maria Salomea Skłodowska, was a Polish and naturalized-French physicist and chemist who conducted pioneering research on radioactivity"
    ></lion-checkbox>
  </lion-checkbox-group>
`;
```

### Event

You can listen to the `model-value-changed` event whenever the value of the checkbox group is changed.

```js preview-story
export const event = () => html`
  <lion-checkbox-group
    name="scientists[]"
    label="Favorite scientists"
    @model-value-changed=${e =>
      (document.getElementById('selectedDinosaur').innerText = JSON.stringify(
        e.target.modelValue,
        null,
        4,
      ))}
  >
    <lion-checkbox label="Archimedes" .choiceValue=${'Archimedes'}></lion-checkbox>
    <lion-checkbox label="Francis Bacon" .choiceValue=${'Francis Bacon'}></lion-checkbox>
    <lion-checkbox label="Marie Curie" .choiceValue=${'Marie Curie'}></lion-checkbox>
  </lion-checkbox-group>
  <br />
  <span>Selected scientists: <strong id="selectedDinosaur">N/A</strong></span>
`;
```

### Indeterminate

```js preview-story
export const indeterminate = () => html`
  <lion-checkbox-group name="scientists[]">
    <lion-checkbox-indeterminate label="Favorite scientists">
      <lion-checkbox slot="checkbox" label="Archimedes"></lion-checkbox>
      <lion-checkbox slot="checkbox" label="Francis Bacon"></lion-checkbox>
      <lion-checkbox slot="checkbox" label="Marie Curie"></lion-checkbox>
    </lion-checkbox-indeterminate>
  </lion-checkbox-group>
`;
```

```js preview-story
export const indeterminateSiblings = () => html`
  <lion-checkbox-group name="scientists[]" label="Favorite scientists">
    <lion-checkbox-indeterminate label="Old Greek scientists">
      <lion-checkbox
        slot="checkbox"
        label="Archimedes"
        .choiceValue=${'Archimedes'}
      ></lion-checkbox>
      <lion-checkbox slot="checkbox" label="Plato" .choiceValue=${'Plato'}></lion-checkbox>
      <lion-checkbox
        slot="checkbox"
        label="Pythagoras"
        .choiceValue=${'Pythagoras'}
      ></lion-checkbox>
    </lion-checkbox-indeterminate>
    <lion-checkbox-indeterminate label="17th Century scientists">
      <lion-checkbox
        slot="checkbox"
        label="Isaac Newton"
        .choiceValue=${'Isaac Newton'}
      ></lion-checkbox>
      <lion-checkbox
        slot="checkbox"
        label="Galileo Galilei"
        .choiceValue=${'Galileo Galilei'}
      ></lion-checkbox>
    </lion-checkbox-indeterminate>
  </lion-checkbox-group>
`;
```

```js preview-story
export const indeterminateChildren = () => html`
  <lion-checkbox-group name="scientists[]" label="Favorite scientists">
    <lion-checkbox-indeterminate label="Scientists">
      <lion-checkbox
        slot="checkbox"
        label="Isaac Newton"
        .choiceValue=${'Isaac Newton'}
      ></lion-checkbox>
      <lion-checkbox
        slot="checkbox"
        label="Galileo Galilei"
        .choiceValue=${'Galileo Galilei'}
      ></lion-checkbox>
      <lion-checkbox-indeterminate slot="checkbox" label="Old Greek scientists">
        <lion-checkbox
          slot="checkbox"
          label="Archimedes"
          .choiceValue=${'Archimedes'}
        ></lion-checkbox>
        <lion-checkbox slot="checkbox" label="Plato" .choiceValue=${'Plato'}></lion-checkbox>
        <lion-checkbox
          slot="checkbox"
          label="Pythagoras"
          .choiceValue=${'Pythagoras'}
        ></lion-checkbox>
      </lion-checkbox-indeterminate>
    </lion-checkbox-indeterminate>
  </lion-checkbox-group>
`;
```
