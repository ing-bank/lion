# Components >> Inputs >> Fieldset >> Overview ||10

`lion-fieldset` groups multiple input fields or other fieldsets together.

```html
<lion-fieldset name="nameGroup" label="Name">
  <lion-input name="firstName" label="First Name" .modelValue=${'Foo'}></lion-input>
  <lion-input name="lastName" label="Last Name" .modelValue=${'Bar'}></lion-input>
</lion-fieldset>
```

We have three specific fieldset implementations:

- [lion-form](/docs/components/inputs/form/overview/)
- [lion-checkbox-group](/docs/components/inputs/checkbox-group/overview/)
- [lion-radio-group](/docs/components/inputs/radio-group/overview/)

A native fieldset element should always have a legend-element for a11y purposes.
However, our fieldset element is not native and should not have a legend-element.
Our fieldset instead has a label attribute or you can add a label with a div- or heading-element using `slot="label"`.

## Features

- Easy retrieval of form data based on field names
- Advanced user interaction scenarios via [interaction states](/docs/systems/form/interaction-states/)
- Can have [validate](/docs/systems/form/validate/) on fieldset level and shows the validation feedback below the fieldset
- Can disable input fields on fieldset level
- Accessible out of the box

## How to use

### Installation

```bash
npm i --save @lion/fieldset
```

```js
import { LionFieldset } from '@lion/fieldset';
// or
import '@lion/fieldset/lion-fieldset.js';
```
