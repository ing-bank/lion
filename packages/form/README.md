# Form

`lion-form` is a webcomponent that enhances the functionality of the native `form` component.
It is designed to interact with (instances of) the [form controls](?path=/docs/forms-system-overview--page).

```js script
import { html } from 'lit-html';
import '@lion/input/lion-input.js';
import './lion-form.js';

export default {
  title: 'Forms/Form/Overview',
};
```

```js story
export const main = () => html`
  <lion-form id="form">
    <form>
      <lion-input name="firstName" label="First Name" .modelValue=${'Foo'}></lion-input>
      <lion-input name="lastName" label="Last Name" .modelValue=${'Bar'}></lion-input>
    </form>
  </lion-form>
`;
```

```js story
export const changeName = () => html`
  <lion-form id="form">
    <form>
      <lion-input name="firstName" label="First Name" .modelValue=${'Foo'}></lion-input>
      <lion-button
        @click=${ev => {
          ev.preventDefault();
          const input = ev.path[4].children[0];
          console.log('@click init:', input.name);
          input.name === 'firstName' ? (input.name = 'secondName') : (input.name = 'firstName');
          console.log('@click end:', input.name);
        }}
        >Toggle name</lion-button
      >
    </form>
  </lion-form>
`;
```

## Features

- Data synchronization with models
- Easy retrieval of form data based on field names
- Advanced validation possibilities
- Advanced user interaction scenarios via [interaction states](?path=/docs/forms-system-interaction-states--interaction-states)
- Registration mechanism for [form controls](?path=/docs/forms-system-overview--page)
- Accessible out of the box

For more information about fields that are designed for lion-form, please read [forms](?path=/docs/forms-system-overview--page).

## How to use

### Installation

```bash
npm i --save @lion/form
```

```js
import '@lion/form/lion-form.js';
```

### Example

```html
<lion-form>
  <form>
    <lion-fieldset name="fullName">
      <lion-input label="First Name" name="firstName"></lion-input>
    </lion-fieldset>
  </form>
</lion-form>
```
