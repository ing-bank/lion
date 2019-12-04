# Input range

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-input-range` component is based on the native range input.
Its purpose is to provide a way for users to select one value from a range of values.

## Features

- Based on [lion-input](../input).
- Shows `modelValue` and `unit` above the range input.
- Shows `min` and `max` value after the range input.
- Can hide the `min` and `max` value via `no-min-max-labels`.
- Makes use of [formatNumber](../localize/docs/number.md) for formatting and parsing.

## How to use

### Installation

```sh
npm i --save @lion/input-range
```

```js
import '@lion/input-range/lion-input-range.js';
```

### Example

```html
<lion-input-range min="200" max="500" .modelValue="${300}" label="Input range"></lion-input-range>
```
