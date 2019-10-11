# Checkbox Group

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-checkbox-group` component is webcomponent that enhances the functionality of the native `<input type="checkbox">` element. Its purpose is to provide a way for users to check **multiple** options amongst a set of choices, or to function as a single toggle.

You should use [lion-checkbox](../checkbox/)'s inside this element.

## Features

Since it extends from [lion-fieldset](../fieldset/), it has all the features a fieldset has.

## How to use

### Installation

```sh
npm i --save @lion/checkbox @lion/checkbox-group
```

```js
import '@lion/checkbox/lion-checkbox.js';
import '@lion/checkbox-group/lion-checkbox-group.js';
```

### Example

```html
<lion-form><form>
  <lion-checkbox-group
    name="scientists"
    label="Who are your favorite scientists?"
    .errorValidators=${[['required']]}
  >
    <lion-checkbox label="Archimedes" .choiceValue=${'Archimedes'}></lion-checkbox>
    <lion-checkbox label="Francis Bacon" .choiceValue=${'Francis Bacon'}></lion-checkbox>
    <lion-checkbox label="Marie Curie" .choiceValue=${'Marie Curie'}></lion-checkbox>
  </lion-checkbox-group>
</form></lion-form>
```

- Make sure that it has a name attribute, this is necessary for the [lion-form](../form/)'s serialization result.
