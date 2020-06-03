# Input range

`lion-input-range` component is based on the native range input.
Its purpose is to provide a way for users to select one value from a range of values.

```js script
import { html } from 'lit-html';

import './lion-input-range.js';

export default {
  title: 'Forms/Input Range',
};
```

```js preview-story
export const main = () => html`
  <lion-input-range min="200" max="500" .modelValue="${300}" label="Input range"></lion-input-range>
`;
```

## Features

- Based on [lion-input](?path=/docs/forms-input--default-story).
- Shows `modelValue` and `unit` above the range input.
- Shows `min` and `max` value after the range input.
- Can hide the `min` and `max` value via `no-min-max-labels`.
- Makes use of [formatNumber](?path=/docs/localize-numbers) for formatting and parsing.

## How to use

### Installation

```bash
npm i --save @lion/input-range
```

```js
import { LionInputRange } from '@lion/input-range';
// or
import '@lion/input-range/lion-input-range.js';
```

## Examples

### Units

```js preview-story
export const units = () => html`
  <style>
    lion-input-range {
      max-width: 400px;
    }
  </style>
  <lion-input-range
    min="0"
    max="100"
    .modelValue="${50}"
    unit="%"
    label="Percentage"
  ></lion-input-range>
`;
```

### Steps

```js preview-story
export const steps = () => html`
  <lion-input-range
    style="max-width: 400px;"
    min="200"
    max="500"
    step="50"
    .modelValue="${300}"
    label="Input range"
    help-text="This slider uses increments of 50"
  ></lion-input-range>
`;
```

### Without Min Max Labels

```js preview-story
export const noMinMaxLabels = () => html`
  <lion-input-range
    style="max-width: 400px;"
    no-min-max-labels
    min="0"
    max="100"
    label="Input range"
  ></lion-input-range>
`;
```

### Disabled

```js preview-story
export const disabled = () => html`
  <lion-input-range
    style="max-width: 400px;"
    disabled
    min="200"
    max="500"
    .modelValue="${300}"
    label="Input range"
  ></lion-input-range>
`;
```
