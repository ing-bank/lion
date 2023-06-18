# Input Password >> Overview ||10

A web component based on the generic text input field. Its purpose is to provide a way for users to type password with min and max length limitations and toggle visibility.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-input-password.js';
```

```js preview-story
export const main = () => {
  return html` <lion-input-password minLength=4 maxLength=13 showVisibilityControl=true label="Password" name="passw"></lion-input-password> `;
};
```

## Features

- Based on our [input](../input/overview.md)
- Makes use of password visibility based on type and input length with corresponding error messages 

## Installation

```bash
npm i --save @lion/ui
```

```js
import { LionInputEmail } from '@lion/ui/input-password.js';
// or
import '@lion/ui/define/lion-input-password.js';
```
