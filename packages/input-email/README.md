# Input Email

[//]: # (AUTO INSERT HEADER PREPUBLISH)

`lion-input-email` component is based on the generic text input field. Its purpose is to provide a way for users to fill in an email.


## Features
- based on [lion-input](../input)
- default label in different languages
- makes use of email [validators](../validate/docs/DefaultValidators.md) with corresponding error messages in different languages
  - isEmail (default)

## How to use

### Installation
```
npm i --save @lion/input-email
```

```js
import '@lion/input-email/lion-input-email.js';
```

### Example

```html
<lion-input-email
  name="email"
  .errorValidators="${[['required']]}"
></lion-input-email>
```
