[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Validate

```js script
import { html } from '@lion/core';
import { LionInput } from '@lion/input';
import { Required, IsString, MaxLength, DefaultSuccess, Validator } from '../../index.js';

import { loadDefaultFeedbackMessages } from '@lion/validate-messages';

export default {
  title: 'Forms/Validation/Overview',
};
```

## Features

- allow for advanced UX scenarios by updating validation state on every value change
- provide a powerful way of writing validation via pure functions
- multiple validation types(error, warning, info, success)
- default validators
- custom validators

Our validation system is designed to:

- allow for advanced UX scenarios by updating validation state on every value change
- provide a powerful way of writing validations via classes

Validation is applied by default to all [form controls](?path=/docs/forms-field-overview--page) via the
ValidateMixin.

For a detailed description of the validation system and the `ValidateMixin`, please see [ValidationSystem](?path=/docs/forms-validation-system--page).

## How to use

### Installation

```bash
npm i --save @lion/form-core
```

```js
import '@lion/input/define';
import { %ValidatorName% } from '@lion/form-core';
```

### Example

> Note that we import an lion-input here as an example of a form control implementing ValidateMixin.
> We could equally well use lion-textarea, lion-select, lion-fieldset etc. to illustrate our example.

```js preview-story
const isInitialsRegex = /^([A-Z]\.)+$/;
class IsInitialsExample extends Validator {
  static get validatorName() {
    return 'IsExampleInitials';
  }

  execute(value) {
    let hasFeedback = false;
    const isStringValidator = new IsString();
    if (isStringValidator.execute(value) || !isInitialsRegex.test(value)) {
      hasFeedback = true;
    }
    return hasFeedback;
  }

  static getMessage({ fieldName }) {
    return `Please enter a valid ${fieldName} in the format "L.I.".`;
  }
}

class DemoInput extends LionInput {
  static get validationTypes() {
    return ['error', 'warning', 'success'];
  }
}
customElements.define('demo-input', DemoInput);

export const main = () => html`
  <demo-input
    label="Initials"
    name="initials"
    .validators="${[
      new Required(),
      new MaxLength(10),
      new IsInitialsExample(null, { type: 'warning' }),
      new DefaultSuccess(),
    ]}"
  ></demo-input>
`;
```

In the example above we use different types of validators.
A validator applied to `.validators` expects an array with a function, a parameters object and
optionally an additional configuration object.

```js
MinMaxLength({ min: 5, max: 10 });
```

The custom `IsInitialsExample` checks if the value is fitting our regex, but does not prevent the user from submitting other values.

Retrieving validity states is as easy as checking for:

```js
myInitialsInput.hasFeedbackFor.include('error');
```

## Default Validation Messages

Lion comes with a set of localized messages for default Validators.
Once the method `loadDefaultFeedbackMessages` is called, it will make sure that all validators provided in `@lion/form-core` will have a default error message.
It uses the `@lion/localize` system to provide these translations and has support for more than 15 locales.

```bash
npm i --save @lion/validate-messages
```

```js
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';
```

```js preview-story
export const defaultValidationMessages = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input
      name="value"
      label="Value"
      .fieldName="${'value'}"
      .validators="${[new Required()]}"
    ></lion-input>
  `;
};
```
