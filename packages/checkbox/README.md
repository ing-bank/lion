# Checkbox

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-checkbox` component is a sub-element to be used in [lion-checkbox-group](../checkbox-group/) elements. Its purpose is to provide a way for users to check **multiple** options amongst a set of choices, or to function as a single toggle.

## Features

- Get the checked state (boolean) - `checked` boolean attribute
- Pre-select an option by setting the `checked` boolean attribute
- Get or set the value of the choice - `choiceValue()`

## How to use

### Installation

```sh
npm i --save @lion/checkbox
```

```js
import '@lion/checkbox/lion-checkbox.js';
```

### Example

```html
<lion-checkbox name="scientists[]" label="Archimedes" .choiceValue=${'Archimedes'}></lion-checkbox>
<lion-checkbox name="scientists[]" label="Francis Bacon" .choiceValue=${'Francis Bacon'}></lion-checkbox>
<lion-checkbox name="scientists[]" label="Marie Curie" .choiceValue=${'Marie Curie'}></lion-checkbox>
```

- Use this component inside a [lion-checkbox-group](../checkbox-group/)
- Make sure that it has a name attribute with appended `[]` for multiple choices.
