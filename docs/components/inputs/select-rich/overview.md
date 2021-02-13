# Inputs >> Select Rich >> Overview ||10

`lion-select-rich` component is a 'rich' version of the native `<select>` element.
It allows to provide fully customized options and a fully customized invoker button.
The component is meant to be used whenever the native `<select>` doesn't provide enough
styling/theming/user interaction opportunities.

Its implementation is based on the following Design pattern:
<https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html>

```js script
import { LitElement, html } from '@lion/core';
import '@lion/listbox/lion-option.js';
import '@lion/select-rich/lion-select-rich.js';
```

```js preview-story
export const main = () => html`
  <lion-select-rich name="favoriteColor" label="Favorite color">
    <lion-option .choiceValue=${'red'}>Red</lion-option>
    <lion-option .choiceValue=${'hotpink'}>Hotpink</lion-option>
    <lion-option .choiceValue=${'blue'}>Blue</lion-option>
  </lion-select-rich>
`;
```

## Features

- Fully accessible
- Flexible api
- Fully customizable option elements
- Fully customizable invoker element
- Mimics native select interaction mode (windows/linux and mac)

## How to use

### Installation

```bash
npm i --save @lion/select-rich
```

```js
import { LionSelectRich, LionOptions, LionOption } from '@lion/select-rich';
// or
import '@lion/select-rich/lion-select-rich.js';
import '@lion/listbox/lion-options.js';
import '@lion/listbox/lion-option.js';
```

> No need to npm install `@lion/option` separately, it comes with the rich select as a dependency
