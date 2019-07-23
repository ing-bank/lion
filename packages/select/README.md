# Select

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-select` component is a wrapper around the native `select`.

You cannot use interactive elements inside the options. Avoid very long names to
facilitate the understandability and perceivability for screen reader users. Sets of options
where each option name starts with the same word or phrase can also significantly degrade
usability for keyboard and screen reader users.

## Features
- catches and forwards the select events
- can be set to required or disabled

## How to use

### Installation
```
npm i --save @lion/select
```

```js
import '@lion/select/lion-select.js';
```

### Example

```html
<lion-select
  name="favoriteColor"
  .errorValidators=${[['required']]}
>
  <div slot="label">Favorite color</div>
  <select slot="input">
    <option selected hidden value>Please select</option>
    <option value="red">Red</option>
    <option value="hotpink">Hotpink</option>
    <option value="teal">Teal</option>
  </select>
</lion-select>
```

You can preselect an option by setting the property modelValue.
```html
<lion-select
  name="favoriteColor"
  .modelValue="${'<value of option 2>'}"
>
  ...
</lion-select>
```
