# Input Amount >> Overview ||10

A web component based on the generic text input field. Its purpose is to provide a way for users to fill in an amount.

For formatting, we use [Intl NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat) with some overrides.

For parsing user input, we provide our own parser that takes into account locale, a number of heuristics and allows for pasting amount strings like 'EUR 100,00'.
Valid characters are digits and separators. Formatting happens on-blur.

If there are no valid characters in the input whatsoever, it will provide an error feedback.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-input-amount.js';
```

```js preview-story
export const main = () => {
  return html`
    <lion-input-amount label="Amount" name="amount" currency="USD"></lion-input-amount>
  `;
};
```

## Features

- Based on our [input](../input/overview.md)
- Makes use of [formatNumber](../../fundamentals/systems/localize/numbers.md) for formatting and parsing.
- Option to show currency as a suffix
- Option to override locale to change the formatting and parsing
- Option to provide additional format options overrides
- Default label in different languages
- Can make use of number specific [validators](../../fundamentals/systems/form/validate.md) with corresponding error messages in different languages
  - IsNumber (default)
  - MinNumber
  - MaxNumber
  - MinMaxNumber

## Installation

```bash
npm i --save @lion/ui
```

```js
import { LionInputAmount } from '@lion/ui/input-amount.js';
// or
import '@lion/ui/define/lion-input-amount.js';
```
