# Inputs >> Input Iban >> Overview ||10

A web component based on the generic text input field.
Its purpose is to provide a way for users to fill in an IBAN (International Bank Account Number).

```js script
import { html } from '@lion/core';
import '@lion/input-iban/define';
```

```js preview-story
export const main = () => {
  return html` <lion-input-iban label="Account" name="account"></lion-input-iban> `;
};
```

## Features

- Based on [lion-input](../input/overview.md)
- Default label in different languages
- Makes use of IBAN specific [validate](../../../docs/systems/form/validate.md) with corresponding error messages in different languages
  - IsIBAN (default)
  - IsCountryIBAN
- Parses IBANs automatically
- Formats IBANs automatically

## Installation

```bash
npm i --save @lion/input-amount
```

```js
import { LionInputIban } from '@lion/input-iban';
// or
import '@lion/input-amount/define';
```
