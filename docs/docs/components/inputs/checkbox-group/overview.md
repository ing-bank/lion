# Components >> Inputs >> Checkbox Group >> Overview ||10

`lion-checkbox-group` component enhances the functionality of the native `<input type="checkbox">` element.
Its purpose is to provide a way for users to check **multiple** options amongst a set of choices, or to function as a single toggle.

> You should use `<lion-checkbox>` elements as the children of the `<lion-checkbox-group>`.

```js script
import { html } from '@lion/core';
import '@lion/checkbox-group/lion-checkbox-group.js';
import '@lion/checkbox-group/lion-checkbox.js';
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

> Make sure that the checkbox-group also has a name attribute, this is necessary for the [lion-form](/docs/components/inputs/form/overview/)'s serialization result.

## Features

Since it extends from [lion-fieldset](/docs/components/inputs/fieldset/overview/),
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
