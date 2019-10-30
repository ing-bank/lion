# Input Email

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-input-email` component is based on the generic text input field. Its purpose is to provide a way for users to fill in an email.

## Features

- based on [lion-input](../input)
- makes use of email [validators](../validate/docs/ValidationSystem.md) with corresponding error messages in different languages
  - IsEmail (default)

## How to use

### Installation

```sh
npm i --save @lion/input-email
```

```js
import '@lion/input-email/lion-input-email.js';

// validator import example
import { Required } from '@lion/validate';
```

### Example

```html
<lion-input-email label="email" name="email" .validators="${['new Required()]}"></lion-input-email>
```
