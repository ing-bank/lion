# Select Rich

[//]: # (AUTO INSERT HEADER PREPUBLISH)

`lion-select-rich` component is a 'rich' version of the native `<select>` element.
It allows to provide fully customized options and a fully customized invoker button.
The component is meant to be used whenever the native `<select>` doesn't provide enough
styling/theming/user interaction opportunities.

Its implementation is based on the following Design pattern:
https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html


## Features
- fully accessible
- flexible api
- fully customizable option elements
- fully customizable invoker element

## How to use

### Installation
```
npm i --save @lion/select-rich
```

```js
import '@lion/select-rich/lion-select-rich.js';
```

### Example

```html
<lion-select-rich
  name="favoriteColor"
  .errorValidators=${[['required']]}
>
  <div slot="label">Favorite color</div>
  <lion-button slot="invoker">Please select</button>
  <lion-listbox slot="input">
    <lion-option value="red">Red</lion-option>
    <lion-option value="hotpink" disabled>Hotpink</lion-option>
    <lion-optgroup>
      <lion-option value="teal">Teal</lion-option>
      <lion-separator></lion-separator>
      <lion-option value="green">Green</lion-option>
    </lion-optgroup>
  </lion-listbox>
</lion-select-rich>
```

You can preselect an option by setting the property modelValue.
 ```html
<lion-select-rich
  name="favoriteColor"
  .modelValue="${'<value of option 2>'}"
>
  ...
</lion-select-rich>
 ```

You can set multiple values.
 ```html
<lion-select-rich
  name="favoriteColor"
  multi
  .modelValue="${['<value of option 2>', '<value of option 2>']}"
>
  ...
</lion-select-rich>
 ```

You can provide an invoker rendering a custom invoker that gets the selected value(s) as an
input property `.selectionData`
 ```html
<lion-select-rich
  ...
>
  <my-invoker-button slot="invoker">
    <!-- rendered content based on selected value(s) -->
  </my-invoker-button>
  ...
</lion-select-rich>
 ```
