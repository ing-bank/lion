# Input Email >> Overview ||10

A web component based on the generic text input field. Its purpose is to provide a way for users to fill in an email.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/input-email/define';
```

```js preview-story
export const main = () => {
  return html` <lion-input-email label="Email" name="email"></lion-input-email> `;
};
```

## Features

- Based on our [input](../input/overview.md)
- Makes use of email [validators](../../fundamentals/systems/form/validate.md) with corresponding error messages in different languages
  - IsEmail (default)

## Installation

```bash
npm i --save @lion/input-email
```

```js
import { LionInputEmail } from '@lion/input-email';
// or
import '@lion/input-email/define';
```
