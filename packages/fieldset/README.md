# Fieldset

`lion-fieldset` groups multiple input fields or other fieldsets together.

```js script
import { html } from 'lit-html';
import '@lion/input/lion-input.js';
import { localize } from '@lion/localize';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';
import { MinLength, Validator, Required } from '@lion/form-core';
import './lion-fieldset.js';
import './docs/helpers/demo-fieldset-child.js';

export default {
  title: 'Forms/Fieldset/Overview',
};
```

We have three specific fieldset implementations:

- [lion-form](?path=/docs/forms-form-overview--main)
- [lion-checkbox-group](?path=/docs/forms-checkbox-group--main)
- [lion-radio-group](?path=/docs/forms-radio-group--main)

```js story
export const main = () => html`
  <lion-fieldset name="nameGroup" label="Name">
    <lion-input name="FirstName" label="First Name"></lion-input>
    <lion-input name="LastName" label="Last Name"></lion-input>
  </lion-fieldset>
`;
```

A native fieldset element should always have a legend-element for a11y purposes.
However, our fieldset element is not native and should not have a legend-element.
Our fieldset instead has a label attribute or you can add a label with a div- or heading-element using `slot="label"`.

## Features

- Easy retrieval of form data based on field names
- Advanced user interaction scenarios via [interaction states](?path=/docs/forms-system-interaction-states--interaction-states)
- Can have [validate](?path=/docs/forms-validation-examples) on fieldset level and shows the validation feedback below the fieldset
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

### Example

```html
<lion-fieldset name="personalia" label="personalia">
  <lion-input name="title" label="Title"></lion-input>
</lion-fieldset>
```

For more examples please look at [Fieldset Examples](?path=/docs/forms-fieldset-examples).
