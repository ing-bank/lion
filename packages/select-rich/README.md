# Select Rich

`lion-select-rich` component is a 'rich' version of the native `<select>` element.
It allows to provide fully customized options and a fully customized invoker button.
The component is meant to be used whenever the native `<select>` doesn't provide enough
styling/theming/user interaction opportunities.

## Live Demo/Documentation

> See our [storybook](http://lion-web-components.netlify.com/?path=/docs/buttons-button) for a live demo and API documentation

## How to use

### Installation

```sh
npm i --save @lion/select-rich
```

```js
import '@lion/select-rich/lion-select-rich.js';
import '@lion/select-rich/lion-options.js';
import '@lion/select-rich/lion-option.js';
```

### Example

```html
<lion-select-rich name="favoriteColor" label="Favorite color">
  <lion-options slot="input">
    <lion-option .choiceValue=${'red'}>Red</lion-option>
    <lion-option .choiceValue=${'hotpink'} checked>Hotpink</lion-option>
  </lion-options>
</lion-select-rich>
```
