# Checkbox Group >> Overview ||10

A checkbox group enhances the functionality of the native `<input type="checkbox">` element.
Its purpose is to provide a way for users to check **multiple** options amongst a set of choices, or to function as a single toggle.

> You should use our `checkbox` elements as children in checkbox group.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/components/define/lion-checkbox-group.js';
import '@lion/components/define/lion-checkbox.js';
```

```js preview-story
export const main = () => html`
  <lion-checkbox-group name="scientists[]" label="Favorite scientists">
    <lion-checkbox label="Archimedes" .choiceValue=${'Archimedes'}></lion-checkbox>
    <lion-checkbox label="Francis Bacon" .choiceValue=${'Francis Bacon'}></lion-checkbox>
    <lion-checkbox label="Marie Curie" .choiceValue=${'Marie Curie'}></lion-checkbox>
  </lion-checkbox-group>
`;
```

> Make sure that the checkbox-group also has a name attribute, this is necessary for our [form](../form/overview.md)'s serialization result.

## Features

Since it extends from our [fieldset](../fieldset/overview.md),
it has all the features a fieldset has.

## Installation

```bash
npm i --save @lion/checkbox-group
```

```js
import '@lion/components/define/lion-checkbox-group.js';
import '@lion/components/define/lion-checkbox.js';
```
