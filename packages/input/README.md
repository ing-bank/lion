# Input

[//]: # (AUTO INSERT HEADER PREPUBLISH)

`lion-input` component is a webcomponent that enhances the functionality of the native `<input>` element.

## Features
- based on [field](../field/)
- extra visual elements can be added via `slots`
  - **label**: can also be provided via the `label` attribute, but the slot can be used to change the `html` and `CSS` of the label.
    For example add an `sr-only` class to the label to make it visually hidden.
    A label is always needed for accessibility reasons.
  - **help-text**: a helper text shown below the label to give extra clarification.
  - **prefix**: does not have an active use case yet, but the option is in place.
  - **suffix**: can be used for addons to the input like a calculator, datepicker or addressbook. In these cases a button with an icon is used.
  - **before**: does not have an active use case yet, but the option is in place.
  - **after**: can be used to show a currency or percentage.
- delegates attributes like type, disabled and read-only to the native input
- can make us of [validate](../validate/)

## How to use

### Installation
```
npm i --save @lion/input;
```

```js
import '@lion/input/lion-input.js';

// validator import example
import { maxLengthValidator } from '@lion/validate';
```

### Example

```html
<lion-input
  label="My label"
  name="myName"
  .modelValue="${foo}"
  .errorValidators="${[['required'], maxLengthValidator(20)]}"
></lion-input>
```

Making use of slots:
```html
<lion-input name="amount">
  <label slot="label">Amount</label>
  <div slot="help-text">Extra information</div>
  <div slot="after">EUR</div>
</lion-input>
```
