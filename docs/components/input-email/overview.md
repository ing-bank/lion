# Input Email >> Overview ||10

A web component based on the generic text input field. Its purpose is to provide a way for users to fill in an email.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-input-email.js';
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
npm i --save @lion/ui
```

```js
import { LionInputEmail } from '@lion/ui/input-email.js';
// or
import '@lion/ui/define/lion-input-email.js';
```
