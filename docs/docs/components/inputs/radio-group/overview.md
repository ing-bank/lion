# Components >> Inputs >> Radio Group >> Overview ||10

`lion-radio-group` component is webcomponent that enhances the functionality of the native `<input type="radio">` element. Its purpose is to provide a way for users to check a **single** option amongst a set of choices.

You should use `<lion-radio>`s inside this element.

```js script
import { html } from '@lion/core';
import '@lion/radio-group/lion-radio-group.js';
import '@lion/radio-group/lion-radio.js';
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

- Make sure that to use a name attribute as it is necessary for the [lion-form](/docs/components/inputs/form/overview/)'s serialization result.
- If you have many options for a user to pick from, consider using [lion-select](/docs/components/inputs/select/overview/) instead

## Features

Since it extends from [lion-fieldset](/docs/components/inputs/fieldset/overview/), it has all the features a fieldset has.

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
