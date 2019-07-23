# Radio-group

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-radio-group` component is webcomponent that enhances the functionality of the native `<input type="radio">` element. Its purpose is to provide a way for users to check a **single** option amongst a set of choices.

You should use [lion-radio](../radio/)'s inside this element.

## Features
Since it extends from [lion-fieldset](../fieldset/), it has all the features a fieldset has.
- Get or set the checked value of the group:
  - modelValue (default) - `checkedValue()`
  - formattedValue - `formattedValue()`
  - serializedValue - `serializedValue()`

## How to use

### Installation
```
npm i --save @lion/radio @lion/radio-group
```

```js
import '@lion/radio/lion-radio.js';
import '@lion/radio-group/lion-radio-group.js';
```

### Example

```html
<lion-form><form>
  <lion-radio-group
    name="dinosGroup"
    label="What are your favourite dinosaurs?"
    .errorValidators=${[['required']]}
  >
    <lion-radio name="dinos[]" label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
    <lion-radio name="dinos[]" label="brontosaurus" .choiceValue=${'brontosaurus'}></lion-radio>
    <lion-radio name="dinos[]" label="diplodocus" .choiceValue=${'diplodocus'} checked></lion-radio>
  </lion-radio-group>
</form></lion-form>
```

- Make sure that to use a name attribute as it is necessary for the [lion-form](../form)'s serialization result.
- If you have many options for a user to pick from, consider using [`lion-select`](../select) instead
