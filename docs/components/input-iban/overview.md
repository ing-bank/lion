# Input Iban >> Overview ||10

A web component based on the generic text input field.
Its purpose is to provide a way for users to fill in an IBAN (International Bank Account Number).

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-input-iban.js';
```

```js preview-story
export const main = () => {
  return html` <lion-input-iban label="Account" name="account"></lion-input-iban> `;
};
```

## Features

- Based on our [input](../input/overview.md)
- Default label in different languages
- Makes use of IBAN specific [validate](../../fundamentals/systems/form/validate.md) with corresponding error messages in different languages
  - IsIBAN (default)
  - IsCountryIBAN
- Parses IBANs automatically
- Formats IBANs automatically

## Installation

```bash
npm i --save @lion/ui
```

```js
import { LionInputIban } from '@lion/ui/input-iban.js';
// or
import '@lion/ui/define/lion-input-amount.js';
```
