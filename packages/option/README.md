# Option

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-option` is a selectable within a [lion-select-rich](../select-rich/)

## Live Demo/Documentation

> See our [storybook](http://lion-web-components.netlify.com/?path=/docs/forms-option) for a live demo and API documentation

## How to use

### Installation

```sh
npm i --save @lion/option
```

```js
import '@lion/option/lion-option.js';
```

### Example

```html
<lion-option .choiceValue=${'hotpink'} checked>Hotpink</lion-option>
```

You can also set the full `modelValue` for each option.

```html
<lion-option .modelValue=${{ value: 'red', checked: false }}>Red</lion-option>
```

This component should not be used standalone. It is not accessible unless it is a child of a listbox-like element.

For more details on usage, please see [lion-select-rich](../select-rich/).
