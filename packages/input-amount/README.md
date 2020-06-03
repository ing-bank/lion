# Input Amount

`lion-input-amount` component is based on the generic text input field. Its purpose is to provide a way for users to fill in an amount.

For formatting, we use <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat" target="_blank">Intl NumberFormat</a> with some overrides.

For parsing user input, we provide our own parser that takes into account a number of heuristics, locale and ignores invalid characters.
Valid characters are digits and separators. Formatting happens on-blur.

If there are no valid characters in the input whatsoever, it will provide an error feedback.

```js script
import { html } from 'lit-html';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';

import './lion-input-amount.js';

export default {
  title: 'Forms/Input Amount',
};

loadDefaultFeedbackMessages();
```

```js preview-story
export const main = () => {
  return html` <lion-input-amount name="amount" currency="USD"></lion-input-amount> `;
};
```

## Features

- Based on [lion-input](?path=/docs/forms-system-overview--page)
- Makes use of [formatNumber](?path=/docs/localize-numbers) for formatting and parsing.
- Option to show currency as a suffix
- Option to override locale to change the formatting and parsing
- Option to provide additional format options overrides
- Default label in different languages
- Can make use of number specific [validators](?path=/docs/forms-validation-overview--page) with corresponding error messages in different languages
  - IsNumber (default)
  - MinNumber
  - MaxNumber
  - MinMaxNumber

## How to use

### Installation

```bash
npm i --save @lion/input-amount
```

```js
import { LionInputAmount } from '@lion/input-amount';
// or
import '@lion/input-amount/lion-input-amount.js';
```

## Examples

### Negative Number

It will accept negative numbers with a minus symbol.

```js preview-story
export const negativeNumber = () => html`
  <lion-input-amount label="Amount" .modelValue=${-123456.78}></lion-input-amount>
`;
```

### Set currency suffix

You can optionally set a currency suffix with the `currency` attribute.

```js preview-story
export const currencySuffix = () => html`
  <lion-input-amount label="Price" currency="USD" .modelValue=${123456.78}></lion-input-amount>
`;
```

### Force locale

Locale can be forced for a specific `lion-input-amount`. It will format the amount according to this locale.

```js preview-story
export const forceLocale = () => html`
  <lion-input-amount
    label="Price"
    currency="JOD"
    .formatOptions=${{ locale: 'nl-NL' }}
    .modelValue=${123456.78}
  ></lion-input-amount>
`;
```

> The separators are now flipped due to Dutch locale. On top of that, due to JOD currency, the minimum amount of decimals is 3 by default for this currency.

### Faulty prefilled

This example will show the error message by prefilling it with a faulty `modelValue`.

> If there is 1 or more digit in the input, it will ignore invalid characters instead of showing an error feedback message.

```js preview-story
export const faultyPrefilled = () => html`
  <lion-input-amount
    label="Amount"
    help-text="Faulty prefilled input will cause error feedback"
    .modelValue=${'foo'}
  ></lion-input-amount>
`;
```

### Modifying the amount of decimals

You can override certain formatting options similar to how you would do this when using <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat" target="_blank">Intl NumberFormat</a>.
This example shows formatting to whole numbers.

```js preview-story
export const noDecimals = () => html`
  <lion-input-amount
    label="Amount"
    help-text="Prefilled and formatted"
    .formatOptions=${{
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }}
    .modelValue=${20}
  >
  </lion-input-amount>
`;
```

### Paste behavior

For copy pasting numbers into the input-amount, there is slightly different parsing behavior.

Normally, when it receives an input with only 1 separator character, we check the locale to determine whether this character is a thousand separator, or a decimal separator.
When a user pastes the input from a different source, we find this approach (locale-based) quite unreliable, because it may have been copied from somewhere with a different locale.
Therefore, we use the heuristics based method to parse the input when it is pasted by the user.

#### What this means

If the user in an English locale types `400,0` it will become `4,000.00`
because the locale determines that the comma is a thousand separator, not a decimal separator.

If the user in an English locale pastes `400,0` instead, it will become `400.00` because we cannot rely on locale.
Therefore, instead, we determine that the comma cannot be a thousand separator because it is not followed by 3 digits after.
It is more likely to be a decimal separator.
