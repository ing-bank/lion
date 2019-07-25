# Select Rich

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-select-rich` component is a 'rich' version of the native `<select>` element.
It allows to provide fully customized options and a fully customized invoker button.
The component is meant to be used whenever the native `<select>` doesn't provide enough
styling/theming/user interaction opportunities.

Its implementation is based on the following Design pattern:
<https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html>

## Features

- fully accessible
- flexible api
- fully customizable option elements
- fully customizable invoker element
- Mimics native select interaction mode (windows/linux and mac)

## How to use

### Installation

```sh
npm i --save @lion/select-rich
```

```js
import '@lion/select-rich/lion-select-rich.js';
import '@lion/select-rich/lion-options.js';
import '@lion/option/lion-option.js';
```

### Example

```html
<lion-select-rich
  name="favoriteColor"
  label="Favorite color"
  .errorValidators=${[['required']]}
>
  <lion-options slot="input">
    <lion-option .choiceValue=${'red'}>Red</lion-option>
    <lion-option .choiceValue=${'hotpink'} checked>Hotpink</lion-option>
  </lion-options>
</lion-select-rich>
```

You can also set the full modelValue for each option.

```html
  <lion-option .modelValue=${{ value: 'red', checked: false }}>Red</lion-option>
```

You can get/set the the checkedIndex and checkedValue

```js
const el = document.querySelector('lion-select-rich');
console.log(el.checkedIndex); // 1
console.log(el.checkedValue); // 'hotpink'
console.log(el.modelValue); // [{ value: 'red', checked: false }, { value: 'hotpink', checked: true }]
```

You can provide an invoker rendering a custom invoker that gets the selected value(s) as an
input property `.selectedElement`

```html
<lion-select-rich>
  <my-invoker-button slot="invoker"></my-invoker-button>
  <lion-options slot="input">
    ...
  </lion-options>
</lion-select-rich>
```

## Other Resources

- [Design Considerations](./docs/DesignConsiderations.md)
