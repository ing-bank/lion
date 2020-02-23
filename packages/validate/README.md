# Validate

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

## Features

- allow for advanced UX scenarios by updating validation state on every value change
- provide a powerful way of writing validation via pure functions
- multiple validation types(error, warning, info, success)
- default validators
- custom validators

Validation is applied by default to all [form controls](../field/docs/FormFundaments.md) via the
ValidateMixin.

For a detailed description of the validation system and the `ValidateMixin`, please see [ValidationSystem](./docs/ValidationSystem.md).

## How to use

### Installation

```sh
npm i --save @lion/validate
```

```js
import '@lion/input/lion-input.js';
import { %ValidatorName% } from '@lion/validate';
```

> Note that we import an lion-input here as an example of a form control implementing ValidateMixin.
> We could equally well use lion-textarea, lion-select, lion-fieldset etc. to illustrate our example.

### Example

All validators are provided as pure functions. They should be applied to the formcontrol (implementing
`ValidateMixin`) as follows:

```js
import '@lion/input/lion-input.js';
import { Required, IsString, MaxLength, DefaultSuccess, Validator } from '@lion/validate';

const isInitialsRegex = /^([A-Z]\.)+$/;
class IsInitialsExample extends Validator {
  constructor(...args) {
    super(...args);
  }

  static get validatorName() {
    return 'IsExampleInitials';
  }

  execute(value) {
    let hasError = false;
    if (!IsString || !isInitialsRegex.test(value.toLowerCase())) {
      hasError = true;
    }
    return hasError;
  }

  static getMessage({ fieldName }) {
    return `Please enter a valid {fieldName} in the format "A.B.C.".`;
  }
}
```

```html
<lion-input
  label="Initials"
  name="initials"
  .validators="${[new Required(), new MaxLength(10), new IsInitialsExample(null, { type: 'warning' }), new DefaultSuccess()]}"
></lion-input>
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
