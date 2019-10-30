# Switch

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-switch` is a component that is used to toggle a property or feature on or off. Toggling the component on or off should have immediate action and should not require pressing any additional buttons (submit) to confirm what just happened. The Switch is not a Checkbox in disguise and should not be used as part of a form.

## Features

- Get or set the checked state (boolean) - `checked` boolean attribute
- Pre-select an option by setting the `checked` boolean attribute
- Get or set the value of the choice - `choiceValue()`

## How to use

### Installation

```sh
npm i --save @lion/switch
```

```js
import '@lion/switch/lion-switch.js';
```

### Example

```html
<lion-switch name="airplaneMode" label="Airplane mode" checked></lion-switch>
```
