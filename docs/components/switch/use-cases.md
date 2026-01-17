---
title: 'Switch: Use Cases'
parts:
  - Switch
  - Use Cases
eleventyNavigation:
  key: 'Switch: Use Cases'
  order: 20
  parent: Switch
  title: Use Cases
---

# Switch: Use Cases

```js script
import { html, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Validator } from '@lion/ui/form-core.js';
import { LionSwitch } from '@lion/ui/switch.js';
import '@lion/ui/define/lion-switch.js';
import '@lion/ui/define-helpers/sb-action-logger.js';
```

## Disabled

You can disable switches.

```html preview-story
<lion-switch label="Label" disabled></lion-switch>
```

## Validation

An example that illustrates how an info validation feedback can be always displayed.

```js preview-story
class IsTrue extends Validator {
  static get validatorName() {
    return 'IsTrue';
  }
  execute(value) {
    return !value.checked;
  }
  static async getMessage() {
    return "You won't get the latest news!";
  }
}

class CustomSwitch extends LionSwitch {
  static get validationTypes() {
    return [...super.validationTypes, 'info'];
  }

  _showFeedbackConditionFor(type, meta) {
    if (type === 'info') {
      return true;
    }
    return super._showFeedbackConditionFor(type, meta);
  }
}
customElements.define('custom-switch', CustomSwitch);

export const validation = () => html`
  <custom-switch
    name="newsletterCheck"
    label="Subscribe to newsletter"
    .validators="${[new IsTrue(null, { type: 'info' })]}"
  ></custom-switch>
`;
```

## With checked-changed handler

You can listen for a `checked-changed` event that is fired when the switch is clicked.

```js preview-story
export const handler = ({ shadowRoot }) => {
  return html`
    <lion-switch
      label="Label"
      @checked-changed="${ev => {
        shadowRoot.querySelector('sb-action-logger').log(`Current value: ${ev.target.checked}`);
      }}"
    >
    </lion-switch>
    <sb-action-logger></sb-action-logger>
  `;
};
```

## Integration in custom component

You can integrate the switch in a custom component and react to state changes using `modelValue.checked`.

```js preview-story
export const integration = ({ shadowRoot }) => {
  class MyElement extends ScopedElementsMixin(LitElement) {
    static get properties() {
      return {
        /**
         * The current checked state of the switch.
         */
        checkedValue: { type: Boolean },
      };
    }

    static get scopedElements() {
      return {
        'lion-switch': LionSwitch,
      };
    }
    constructor() {
      super();
      this.checkedValue = false;
      this._shadowRoot = shadowRoot;
    }

    render() {
      return html`
        <lion-switch
          label="Toggle feature"
          @checked-changed=${this._onVisibilityChanged}
        ></lion-switch>
        <p>Checked value is ${this.checkedValue}</p>
      `;
    }

    _onVisibilityChanged(e) {
      this.checkedValue = e.currentTarget.modelValue.checked;
      this._shadowRoot.querySelector('sb-action-logger').log(`Checked: ${this.checkedValue}`);
    }
  }
  customElements.define('my-switch', MyElement);

  return html`
    <my-switch></my-switch>
    <sb-action-logger></sb-action-logger>
  `;
};
```
