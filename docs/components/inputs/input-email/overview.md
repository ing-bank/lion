# Inputs >> Input Email >> Overview ||10

`lion-input-email` component is based on the generic text input field. Its purpose is to provide a way for users to fill in an email.

```js script
import { html } from '@lion/core';
import '@lion/input-email/lion-input-email.js';
```

```js preview-story
export const main = () => {
  return html` <lion-input-email label="Email" name="email"></lion-input-email> `;
};
```

## Features

- Based on [lion-input](../input/overview.md)
- Makes use of email [validators](/docs/systems/form/validate/) with corresponding error messages in different languages
  - IsEmail (default)

## How to use

### Installation

```bash
npm i --save @lion/input-email
```

```js
import { LionInputEmail } from '@lion/input-email';
// or
import '@lion/input-email/lion-input-email.js';
```
