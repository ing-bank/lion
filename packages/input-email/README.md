# Input Email

`lion-input-email` component is based on the generic text input field. Its purpose is to provide a way for users to fill in an email.

```js script
import { html } from '@lion/core';
import { Validator } from '@lion/form-core';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';

import './lion-input-email.js';

export default {
  title: 'Forms/Input Email',
};
loadDefaultFeedbackMessages();
```

```js preview-story
export const main = () => {
  return html` <lion-input-email label="Email" name="email"></lion-input-email> `;
};
```

## Features

- Based on [lion-input](?path=/docs/forms-input--main#input)
- Makes use of email [validators](?path=/docs/forms-validation-overview--main#validate) with corresponding error messages in different languages
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

## Examples

### Faulty Prefilled

When prefilling with a faulty input, an error feedback message will show.

Use `loadDefaultFeedbackMessages` to get our default feedback messages displayed on it.

```js preview-story
export const faultyPrefilled = () => html`
  <lion-input-email .modelValue=${'foo'} label="Email"></lion-input-email>
`;
```

### Custom Validator

```js preview-story
export const customValidator = () => {
  class GmailOnly extends Validator {
    static get validatorName() {
      return 'GmailOnly';
    }
    execute(value) {
      let hasError = false;
      if (!(value.indexOf('gmail.com') !== -1)) {
        hasError = true;
      }
      return hasError;
    }
    static async getMessage() {
      return 'You can only use gmail.com email addresses.';
    }
  }
  return html`
    <lion-input-email
      .modelValue=${'foo@bar.com'}
      .validators=${[new GmailOnly()]}
      label="Email"
    ></lion-input-email>
  `;
};
```
