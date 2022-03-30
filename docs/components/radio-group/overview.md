# Radio Group >> Overview ||10

A web component that enhances the functionality of the native `<input type="radio">` element. Its purpose is to provide a way for users to check a **single** option amongst a set of choices.

You should use our `radio` inside this element.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/radio-group/define';
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

- Make sure that to use a name attribute as it is necessary for our [form](../form/overview.md)'s serialization result.
- If you have many options for a user to pick from, consider using our [select](../select/overview.md) instead.

## Features

Since it extends from our [fieldset](../fieldset/overview.md), it has all the features a fieldset has.

- Get or set the checked value of the group:
  - modelValue (default) - `checkedValue()`
  - formattedValue - `formattedValue()`
  - serializedValue - `serializedValue()`

## Installation

```bash
npm i --save @lion/radio-group
```

```js
import { LionRadioGroup, LionRadio } from '@lion/radio-group';
// or
import '@lion/radio-group/define';
```
