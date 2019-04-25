# Default Validators

Default validator functions are the equivalent of native form validators, like required or min-length.

## Features

- list of validators:
  - **required**: validates if the field is not empty.
  - **length**: validates the length of the input.
    - isString
    - equalsLength
    - minLength
    - maxLength
    - minMaxLength
  - **number**: validates if the input is a number and the value of the number.
    - isNumber
    - minNumber
    - maxNumber
    - minMaxNumber
  - **date**: validates if the input is a date and the value of the date.
    - isDate
    - minDate
    - maxDate
    - minMaxDate
  - **email**: validates if the input is of type email.
  - **success**: returns always falls, will be shown after a successful improvement of the value
    - defaultOk
    - randomOk
- all default validators have corresponding messages which are translated via the [localize system](../../localize/)

## How to use

### Installation

```sh
npm i --save @lion/validate
```

### Example

All validators are provided as pure functions and are added to your input field as follows:

```js
import { maxLengthValidator } from '@lion/validate';
import '@lion/input/ing-input.js';
```

```html
<ing-input
  label="Initials"
  name="initials"
  .errorValidators="${[['required'], maxLengthValidator(10)]}"
></ing-input>
```
