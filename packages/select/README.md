# Select

`lion-select` component is a wrapper around the native `select`.

You cannot use interactive elements inside the options. Avoid very long names to
facilitate the understandability and perceivability for screen reader users. Sets of options
where each option name starts with the same word or phrase can also significantly degrade
usability for keyboard and screen reader users.

```js script
import { html } from 'lit-html';
import { Required } from '@lion/form-core';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';

import './lion-select.js';

export default {
  title: 'Forms/Select',
};
loadDefaultFeedbackMessages();
```

```js preview-story
export const main = () => html`
  <lion-select name="favoriteColor" label="Favorite color">
    <select slot="input">
      <option selected hidden value>Please select</option>
      <option value="red">Red</option>
      <option value="hotpink">Hotpink</option>
      <option value="teal">Teal</option>
    </select>
  </lion-select>
`;
```

## Live Demo/Documentation

> See our [storybook](http://lion-web-components.netlify.com/?path=/docs/forms-select--default-story) for a live demo and API documentation

For this form element it is important to put the `slot="input"` with the native `select` yourself, because you are responsible for filling it with `<option>`s.
For most other form elements in `lion` we do this for you, because there's no need to put html inside the native form inputs.

## Features

- Catches and forwards the select events
- Can be set to required or disabled

## How to use

### Installation

```bash
npm i --save @lion/select
```

```js
import { LionSelect } from '@lion/select';
// or
import '@lion/select/lion-select.js';
```

## Examples

### Pre-select

You can preselect an option by setting the property modelValue.

```js preview-story
export const preSelect = () => html`
  <lion-select name="favoriteColor" label="Favorite color" .modelValue=${'hotpink'}>
    <select slot="input">
      <option selected hidden value>Please select</option>
      <option value="red">Red</option>
      <option value="hotpink">Hotpink</option>
      <option value="teal">Teal</option>
    </select>
  </lion-select>
`;
```

### Disabled

You can disable an option by adding the `disabled` attribute to an option.

```js preview-story
export const disabledOption = () => html`
  <lion-select name="favoriteColor" label="Favorite color">
    <select slot="input">
      <option selected hidden value>Please select</option>
      <option value="red">Red</option>
      <option value="hotpink" disabled>Hotpink</option>
      <option value="teal">Teal</option>
    </select>
  </lion-select>
`;
```

Or by setting the `disabled` attribute on the entire `lion-select` field.

```js preview-story
export const disabledSelect = () => html`
  <lion-select name="favoriteColor" label="Favorite color" disabled>
    <select slot="input">
      <option selected hidden value>Please select</option>
      <option value="red">Red</option>
      <option value="hotpink">Hotpink</option>
      <option value="teal">Teal</option>
    </select>
  </lion-select>
`;
```

### Validation

```js preview-story
export const validation = () => {
  const validate = () => {
    const select = document.querySelector('#color');
    select.submitted = !select.submitted;
  };
  return html`
    <lion-select id="color" name="color" .validators="${[new Required()]}">
      <label slot="label">Favorite color</label>
      <select slot="input">
        <option selected hidden value>Please select</option>
        <option value="red">Red</option>
        <option value="hotpink">Hotpink</option>
        <option value="teal">Teal</option>
      </select>
    </lion-select>
    <button @click="${() => validate()}">Validate</button>
  `;
};
```
