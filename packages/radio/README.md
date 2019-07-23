# Radio

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-radio` component is a sub-element to be used in [lion-radio-group](../radio-group/) elements. Its purpose is to provide a way for users to check a **single** option amongst a set of choices.

## Features
- Get or set the checked state (boolean) - `choiceChecked()`
- Get or set the value of the choice - `choiceValue()`
- Pre-select an option by setting the `checked` boolean attribute

## How to use

### Installation
```
npm i --save @lion/radio;
```

```js
import '@lion/radio/lion-radio.js';
```

### Example

```html
<lion-radio name="dinos[]" label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
<lion-radio name="dinos[]" label="brontosaurus" .choiceValue=${'brontosaurus'}></lion-radio>
<lion-radio name="dinos[]" label="diplodocus" .choiceValue=${'diplodocus'} checked></lion-radio>
```

- Use this component inside a [lion-radio-group](../radio-group/)
- Make sure that it has a name attribute with appended `[]` for multiple choices.
