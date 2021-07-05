# Interaction >> Switch >> Overview ||10

<p class="paragraph--emphasis">The Switch is used to toggle a property or feature on or off.</p>

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/switch/define-switch';
```

```js preview-story
export const main = () => html`<lion-switch label="Label" help-text="Help text"></lion-switch>`;
```

## When to use

- Toggling the component on or off has an immediate action (no confirmation by the user required).
- The Switch is typically used in setting applications.
- The Switch is not a Checkbox in disguise and can not be used as part of a form.

## Features

- Get or set the checked state (boolean) - `checked` boolean attribute
- Pre-select an option by setting the `checked` boolean attribute
- Get or set the value of the choice - `choiceValue()`

## How to use

### Installation

```bash
npm i --save @lion/switch
```

```js
import { LionSwitch } from '@lion/switch';
// or
import '@lion/switch/define-switch';
```
