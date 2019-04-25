# Validate

[//]: # (AUTO INSERT HEADER PREPUBLISH)

## Features

- allow for advanced UX scenarios by updating validation state on every value change
- provide a powerful way of writing validation via pure functions
- multiple validation types(error, warning, info, success)
- [default validators](./docs/DefaultValidators.md)
- [custom validators](./docs/tutorials/CustomValidatorsTutorial.md)

Validation is applied by default to all [form controls](../field/docs/FormFundaments.md) via the
ValidateMixin.

For a detailed description of the validation system and the `ValidateMixin`, please see
[ValidationSystem](./docs/ValidationSystem.md).

## How to use

### Installation

```sh
npm i --save @lion/validate
```

```js
import '@lion/input/lion-input.js';
import { %validatorName% } from '@lion/validate';
```

> Note that we import an lion-input here as an example of a form control implementing ValidateMixin.
We could equally well use lion-textarea, lion-select, lion-fieldset etc. to illustrate our example.

### Example

All validators are provided as pure functions. They should be applied to the formcontrol (implementing
`ValidateMixin`) as follows:

```js
import '@lion/input/lion-input.js';
import { isString, maxLengthValidator, defaultOkValidator } from '@lion/validate';

const isInitialsRegex = /^([A-Z]\.)+$/;
export const isExampleInitials = value => isString(value) && isInitialsRegex.test(value.toUpperCase());
export const isExampleInitialsValidator = () => [
  (...params) => ({ isExampleInitials: isExampleInitials(...params) }),
];
```

```html
<lion-input
  label="Initials"
  name="initials"
  .errorValidators="${[['required], maxLengthValidator(10)]}"
  .warningValidators="${[isExampleInitialsValidator()]}"
  .successValidators="${[defaultOkValidator()]}"
></lion-input>
```

In the example above we use different types of validators.
A validator applied to `.errorValidators` expects an array with a function, a parameters object and
optionally an additional configuration object.

```js
minMaxLengthValidator({ min: 5, max: 10 })
```

The custom `isExampleInitialsValidator` checks if the value is fitting our regex, but does not
prevent the user from submitting other values.

Retrieving validity states is as easy as checking for:

```js
myInitialsInput.errorState === false;
```
