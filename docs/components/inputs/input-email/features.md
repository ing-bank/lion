# Inputs >> Input Email >> Features ||20

```js script
import { html } from '@mdjs/mdjs-preview';
import { Validator } from '@lion/form-core';
import '@lion/input-email/define';
```

## Faulty Prefilled

When prefilling with a faulty input, an error feedback message will show.

Use `loadDefaultFeedbackMessages` to get our default feedback messages displayed on it.

```js preview-story
export const faultyPrefilled = () => html`
  <lion-input-email .modelValue=${'foo'} label="Email"></lion-input-email>
`;
```

## Custom Validator

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
