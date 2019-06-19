# Input Range

[//]: # (AUTO INSERT HEADER PREPUBLISH)

`lion-input-range` component is a webcomponent that enhances the functionality of the native `<input type="range">` element.

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
- delegates attributes like min, max, step and disabled to the native input
- can make use of [validate](../validate/)

## How to use

### Installation
```
npm i --save @lion/input-range;
```

```js
import '@lion/input-range.js';
```

### Example

```html
<lion-input-range
  label="My label"
  name="myName"
  .modelValue="${foo}"
  .min="1000"
  .max="20000"
></lion-input-range>
```

Making use of slots:
```html
<lion-input-range name="amount">
  <label slot="label">Amount</label>
  <div slot="help-text">Extra information</div>
  <div slot="after">EUR</div>
</lion-input-range>
```
