# Switch

`lion-switch` is a component that is used to toggle a property or feature on or off. Toggling the component on or off should have immediate action and should not require pressing any additional buttons (submit) to confirm what just happened. The Switch is not a Checkbox in disguise and should not be used as part of a form.

```js script
import { html } from 'lit-html';
import { Validator } from '@lion/validate';
import { LionSwitch } from './index.js';
import './lion-switch.js';
import '@lion/helpers/sb-action-logger.js';

export default {
  title: 'Buttons/Switch',
};
```

```js story
export const main = () => html` <lion-switch label="Label" help-text="Help text"></lion-switch> `;
```

## Live Demo/Documentation

> See our [storybook](http://lion-web-components.netlify.com/?path=/docs/buttons-switch) for a live demo and documentation

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
import '@lion/switch/lion-switch.js';
```

### Example

```html
<lion-switch name="airplaneMode" label="Airplane mode" checked></lion-switch>
```

### Disabled

You can disable switches.

```js preview-story
export const disabled = () => html` <lion-switch label="Label" disabled></lion-switch> `;
```

### Validation

Simple example that illustrates where validation feedback will be displayed.

```js preview-story
export const validation = () => {
  const IsTrue = class extends Validator {
    static get validatorName() {
      return 'IsTrue';
    }
    execute(value) {
      return !value.checked;
    }
    static async getMessage() {
      return "You won't get the latest news!";
    }
  };
  const tagName = 'custom-switch';
  if (!customElements.get(tagName)) {
    customElements.define(
      tagName,
      class CustomSwitch extends LionSwitch {
        static get validationTypes() {
          return [...super.validationTypes, 'info'];
        }
      },
    );
  }
  return html`
    <custom-switch
      id="newsletterCheck"
      name="newsletterCheck"
      label="Subscribe to newsletter"
      .validators="${[new IsTrue(null, { type: 'info' })]}"
    ></custom-switch>
  `;
};
```

### With checked-changed handler

You can listen for a `checked-changed` event that is fired when the switch is clicked.

```js preview-story
export const handler = () => {
  const uid = Math.random().toString(36).substr(2, 10);
  return html`
    <lion-switch
      label="Label"
      @checked-changed="${e => {
        document.getElementById(`logger-${uid}`).log(`Current value: ${e.target.checked}`);
      }}"
    >
    </lion-switch>
    <sb-action-logger id="logger-${uid}"></sb-action-logger>
  `;
};
```
