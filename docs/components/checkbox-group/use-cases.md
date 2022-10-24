# Checkbox Group >> Use Cases ||20

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-checkbox-group.js';
import '@lion/ui/define/lion-checkbox.js';
```

## Model value

The `modelValue` of a `lion-checkbox-group` is an array containing the `choiceValues` of the `lion-checkbox` elements that have been checked.

Given the scientists example above, say that we were to select the first and last options
(Archimedes & Marie Curie).

Then the `modelValue` of the `lion-checkbox-group` will look as follows:

```js
const groupElement = [parent].querySelector('lion-checkbox-group');
groupElement.modelValue;
  => ["Archimedes", "Marie Curie"];
```

## The `name` attribute

The `name` attribute of a `lion-checkbox-group` automatically gets assigned to its `lion-checkbox` children. You can also specify names for the `lion-checkbox` elements, but if this name is different from the name assigned to `lion-checkbox-group`, then an exception will be thrown.

Our recommendation would be to set the `name` attribute only on the `lion-checkbox-group` and not on the `lion-checkbox` elements.

## Example

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

## Pre-select

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

## Disabled

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

## Label

You can use `slot="label"` instead of the `label` attribute for defining more complex labels, such as containing screen reader only text or an anchor.

```js preview-story
export const label = () => html`
  <lion-checkbox-group name="scientists[]" label="Favorite scientists">
    <lion-checkbox .choiceValue=${'Archimedes'}>
      <label slot="label"
        ><a href="https://wikipedia.org/wiki/Archimedes" target="_blank">Archimedes</a></label
      >
    </lion-checkbox>
    <lion-checkbox .choiceValue=${'Francis Bacon'}>
      <label slot="label"
        ><a href="https://wikipedia.org/wiki/Francis_Bacon" target="_blank">Francis Bacon</a></label
      >
    </lion-checkbox>
    <lion-checkbox .choiceValue=${'Marie Curie'}>
      <label slot="label"
        ><a href="https://wikipedia.org/wiki/Marie_Curie" target="_blank">Marie Curie</a></label
      >
    </lion-checkbox>
  </lion-checkbox-group>
`;
```

## Help text

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

## Event

You can listen to the `model-value-changed` event whenever the value of the checkbox group is changed.

```js preview-story
export const event = ({ shadowRoot }) => html`
  <lion-checkbox-group
    name="scientists[]"
    label="Favorite scientists"
    @model-value-changed=${ev =>
      (ev.target.parentElement.querySelector('#selectedDinosaur').innerText = JSON.stringify(
        ev.target.modelValue,
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

## Indeterminate

A `checkbox-indeterminate`'s value is neither true nor false, but is instead indeterminate, meaning that its state cannot be determined or stated in pure binary terms, based on it's `checkbox` children.

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

The `checkbox-indeterminate` can have another `checkbox-indeterminate` as a child.

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

You can also use `mixed-state` attribute so your indeterminate checkbox toggles through three states (indeterminate, checked, unchecked), where for indeterminate state the old children states are restored when you toggle back into this.

```js preview-story
export const mixedState = () => html`
  <lion-checkbox-group name="scientists[]" label="Favorite scientists">
    <lion-checkbox-indeterminate mixed-state label="Scientists">
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
      <lion-checkbox-indeterminate mixed-state slot="checkbox" label="Old Greek scientists">
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
