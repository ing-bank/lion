# Input IBAN

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-input-iban` component is based on the generic text input field. Its purpose is to provide a way for users to fill in an iban.

## Features

- based on [lion-input](../input)
- default label in different languages
- makes use of IBAN specific [validate](../validate) with corresponding error messages in different languages
  - IsIBAN (default)
  - IsCountryIBAN

## How to use

### Installation

```sh
npm i --save @lion/input-amount
```

```js
import '@lion/input-amount/lion-input-amount.js';

// validator import example
import { Required, IsCountryIBAN } from '@lion/validate';
```

### Example

```html
<lion-input-iban
  name="account"
  .validators="${[new Required(), new IsCountryIBAN('BE')]}"
></lion-input-iban>
```
