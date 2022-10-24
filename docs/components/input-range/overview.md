# Input Range >> Overview ||10

A web component based on the native range input. Its purpose is to provide a way for users to select one value from a range of values.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-input-range.js';
```

```js preview-story
export const main = () => html`
  <lion-input-range min="200" max="500" .modelValue="${300}" label="Input range"></lion-input-range>
`;
```

## Features

- Based on our [input](../input/overview.md).
- Shows `modelValue` and `unit` above the range input.
- Shows `min` and `max` value after the range input.
- Can hide the `min` and `max` value via `no-min-max-labels`.
- Makes use of [formatNumber](../../fundamentals/systems/localize/numbers.md) for formatting and parsing.

## Installation

```bash
npm i --save @lion/ui
```

```js
import { LionInputRange } from '@lion/ui/input-range.js';
// or
import '@lion/ui/define/lion-input-range.js';
```
