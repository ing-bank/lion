# Switch >> Use Cases ||20

```js script
import { html } from '@mdjs/mdjs-preview';
import { Validator } from '@lion/components/form-core.js';
import { LionSwitch } from '@lion/components/switch.js';
import '@lion/components/define/lion-switch.js';
import '@lion/components/define-helpers/sb-action-logger.js';
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
