# Inputs >> Select >> Overview ||10

`lion-select` component is a wrapper around the native `select`.

You cannot use interactive elements inside the options. Avoid very long names to
facilitate the understandability and perceivability for screen reader users. Sets of options
where each option name starts with the same word or phrase can also significantly degrade
usability for keyboard and screen reader users.

```js script
import { html } from '@lion/core';
import '@lion/select/lion-select.js';
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
