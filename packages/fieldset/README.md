# Fieldset

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

`lion-fieldset` groups multiple input fields or other fieldsets together.

Two specific types of fieldsets:

- [lion-checkbox-group](../checkbox-group/)
- [lion-radio-group](../radio-group/)

## Features

- easy retrieval of form data based on field names
- advanced user interaction scenarios via [interaction states](../field/docs/InteractionStates.md)
- can have [validate](../validate/) on fieldset level and shows the validation feedback below the fieldset
- can disable input fields on fieldset level
- accessible out of the box

## How to use

### Installation

```sh
npm i --save @lion/fieldset;
```

```js
import '@lion/fieldset/lion-fieldset.js';
import '@lion/input/lion-input.js';
```

### Example

```html
<lion-fieldset name="personalia" label="personalia">
  <lion-input name="title" label="Title"></lion-input>
  <lion-fieldset name="fullName" label="Full name" .errorValidations="${[['required]]}">
    <lion-input name="firstName" label="First name"></lion-input>
    <lion-input name="lastName" label="Last name"></lion-input>
  </lion-fieldset>
</lion-fieldset>
```
