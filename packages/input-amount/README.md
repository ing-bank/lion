# Input Amount

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-input-amount` component is based on the generic text input field. Its purpose is to provide a way for users to fill in an amount.

## Features

- based on [lion-input](../input)
- makes use of [formatNumber](../localize/docs/number.md) for formatting and parsing.
- option to show currency as a suffix
- option to override locale to change the formatting and parsing
- option to provide additional format options overrides
- default label in different languages
- can make use of number specific [validators](../validate/docs/ValidationSystem.md) with corresponding error messages in different languages
  - IsNumber (default)
  - MinNumber
  - MaxNumber
  - MinMaxNumber

## How to use

### Installation

```sh
npm i --save @lion/input-amount
```

```js
import '@lion/input-amount/lion-input-amount.js';

// validator import example
import { Required, MinNumber } from '@lion/validate';
```

### Example

```html
<lion-input-amount
  name="amount"
  currency="USD"
  .validators="${[new Required(), new MinNumber(100)]}"
></lion-input-amount>
```
