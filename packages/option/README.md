# LionOption

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-option` is a selectable within a [lion-select-rich](../select-rich/)

## Features

- has checked state
- has a modelValue
- can be disabled
- fully accessible

## How to use

### Installation

```sh
npm i --save @lion/select-rich
```

```js
import '@lion/select-rich/lion-select-rich.js';
import '@lion/select-rich/lion-options.js';
import '@lion/option/lion-option.js';

// validator import example
import { Required } from '@lion/validate';
```

### Example

```html
<lion-select-rich
  name="favoriteColor"
  label="Favorite color"
  .validators=${[new Required()]}
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

For more details please see [lion-select-rich](../select-rich/).
