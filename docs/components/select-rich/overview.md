# Select Rich >> Overview ||10

This web component is a 'rich' version of the native `<select>` element.
It allows providing fully customized options and a fully customized invoker button and is meant to be used whenever the native `<select>` doesn't provide enough
styling,theming or user interaction opportunities.

Its implementation is based on the following Design pattern:
<https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/>

```js script
import { LitElement, html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-select-rich.js';
import '@lion/ui/define/lion-option.js';
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
- Flexible API
- Fully customizable option elements
- Fully customizable invoker element
- Mimics native select interaction mode (windows/linux and mac)

## Installation

```bash
npm i --save @lion/ui
```

```js
import { LionSelectRich } from '@lion/ui/select-rich.js';
import { LionOptions, LionOption } from '@lion/ui/listbox.js';
// or
import '@lion/ui/define/lion-select-rich.js';
import '@lion/ui/define/lion-option.js';
```
