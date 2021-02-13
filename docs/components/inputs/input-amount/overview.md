# Inputs >> Input Amount >> Overview ||10

`lion-input-amount` component is based on the generic text input field. Its purpose is to provide a way for users to fill in an amount.

For formatting, we use [Intl NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat) with some overrides.

For parsing user input, we provide our own parser that takes into account a number of heuristics, locale and ignores invalid characters.
Valid characters are digits and separators. Formatting happens on-blur.

If there are no valid characters in the input whatsoever, it will provide an error feedback.

```js script
import { html } from '@lion/core';
import '@lion/input-amount/lion-input-amount.js';
```

```js preview-story
export const main = () => {
  return html`
    <lion-input-amount label="Amount" name="amount" currency="USD"></lion-input-amount>
  `;
};
```

## Features

- Based on [lion-input](../input/overview.md)
- Makes use of [formatNumber](/docs/systems/localize/numbers/) for formatting and parsing.
- Option to show currency as a suffix
- Option to override locale to change the formatting and parsing
- Option to provide additional format options overrides
- Default label in different languages
- Can make use of number specific [validators](/docs/systems/form/validate/) with corresponding error messages in different languages
  - IsNumber (default)
  - MinNumber
  - MaxNumber
  - MinMaxNumber

## Installation

```bash
npm i --save @lion/input-amount
```

```js
import { LionInputAmount } from '@lion/input-amount';
// or
import '@lion/input-amount/lion-input-amount.js';
```
