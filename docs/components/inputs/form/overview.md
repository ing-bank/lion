# Inputs >> Form >> Overview ||10

```js script
import { html } from '@lion/core';

import '@lion/input/define';
import '@lion/form/define';
```

A web component that enhances the functionality of the native `form` component.
It is designed to interact with (instances of) the [form controls](../overview.md).

```js preview-story
export const main = () => html`
  <lion-form>
    <form>
      <lion-input name="firstName" label="First Name" .modelValue=${'Foo'}></lion-input>
      <lion-input name="lastName" label="Last Name" .modelValue=${'Bar'}></lion-input>
    </form>
  </lion-form>
`;
```

## Features

- Data synchronization with models
- Easy retrieval of form data based on field names
- Advanced validation possibilities
- Advanced user interaction scenarios via [interaction states](../../../docs/systems/form/interaction-states.md)
- Registration mechanism for form controls
- Accessible out of the box

For more information about fields that are designed for `lion-form`, please read [form system](../../../docs/systems/form/overview.md).

## Installation

```bash
npm i --save @lion/form
```

```js
import '@lion/form/define';
```
