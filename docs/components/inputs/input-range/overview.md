# Inputs >> Input Range >> Overview ||10

A web component based on the native range input. Its purpose is to provide a way for users to select one value from a range of values.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/input-range/define';
```

```js preview-story
export const main = () => html`
    <lion-input-range-group
    style="max-width: 400px;"
    min="10"
    max="300"
    .modelValue="${{ low: 40, high: 200 }}"
    label="Input range multi-thumb"
  ></lion-input-range-group>
`;
```

## Features

- Based on our [input](../input/overview.md).
- Shows `modelValue` and `unit` above the range input.
- Shows `min` and `max` value after the range input.
- Can hide the `min` and `max` value via `no-min-max-labels`.
- Makes use of [formatNumber](../../../docs/systems/localize/numbers.md) for formatting and parsing.

## Installation

```bash
npm i --save @lion/input-range
```

```js
import { LionInputRange } from '@lion/input-range';
// or
import '@lion/input-range/define';
```
