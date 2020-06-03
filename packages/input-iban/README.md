[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Input IBAN

`lion-input-iban` component is based on the generic text input field.
Its purpose is to provide a way for users to fill in an IBAN (International Bank Account Number).

```js script
import { html } from 'lit-html';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';
import { IsCountryIBAN } from './src/validators.js';

import './lion-input-iban.js';

export default {
  title: 'Forms/Input Iban',
};

loadDefaultFeedbackMessages();
```

```js preview-story
export const main = () => {
  return html` <lion-input-iban label="Account" name="account"></lion-input-iban> `;
};
```

## Features

- Based on [lion-input](?path=/docs/forms-input--default-story)
- Default label in different languages
- Makes use of IBAN specific [validate](?path=/docs/forms-validation-overview--page) with corresponding error messages in different languages
  - IsIBAN (default)
  - IsCountryIBAN
- Parses IBANs automatically
- Formats IBANs automatically

## How to use

### Installation

```bash
npm i --save @lion/input-amount
```

```js
import { LionInputIban } from '@lion/input-iban';
// or
import '@lion/input-amount/lion-input-amount.js';
```

## Examples

### Prefilled

```js preview-story
export const prefilled = () => html`
  <lion-input-iban .modelValue=${'NL20INGB0001234567'} name="iban" label="IBAN"></lion-input-iban>
`;
```

### Faulty Prefilled

```js preview-story
export const faultyPrefilled = () => html`
  <lion-input-iban
    .modelValue=${'NL20INGB0001234567XXXX'}
    name="iban"
    label="IBAN"
  ></lion-input-iban>
`;
```

### Country Restrictions

By default, we validate the input to ensure the IBAN is valid.
To get the default feedback message for this default validator, use `loadDefaultFeedbackMessages` from `@lion/validate`.

In the example below, we show how to use an additional validator that restricts the `input-iban` to IBANs from only certain countries.

```js preview-story
export const countryRestrictions = () => html`
  <lion-input-iban
    .modelValue=${'DE89370400440532013000'}
    .validators=${[new IsCountryIBAN('NL')]}
    name="iban"
    label="IBAN"
  ></lion-input-iban>
  <br />
  <small>Demo instructions: you can use NL20 INGB 0001 2345 67</small>
`;
```
