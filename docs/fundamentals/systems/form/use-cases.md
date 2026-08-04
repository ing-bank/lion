---
parts:
  - Use Cases
  - Form
  - Systems
title: 'Form: Use Cases'
eleventyNavigation:
  key: Systems >> Form >> Use Cases
  title: Use Cases
  order: 50
  parent: Systems >> Form
---

# Form: Use Cases

This is a meta package to show interaction between various form elements.
For usage and installation please see the appropriate packages.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-button.js';
import '@lion/ui/define/lion-checkbox-group.js';
import '@lion/ui/define/lion-checkbox.js';
import '@lion/ui/define/lion-combobox.js';
import '@lion/ui/define/lion-option.js';
import '@lion/ui/define/lion-fieldset.js';
import '@lion/ui/define/lion-form.js';
import '@lion/ui/define/lion-input-amount.js';
import '@lion/ui/define/lion-input-date.js';
import '@lion/ui/define/lion-input-datepicker.js';
import '@lion/ui/define/lion-input-email.js';
import '@lion/ui/define/lion-input-file.js';
import '@lion/ui/define/lion-input-tel.js';
import '@lion/ui/define/lion-input-tel-dropdown.js';
import '@lion/ui/define/lion-input-iban.js';
import '@lion/ui/define/lion-input-range.js';
import '@lion/ui/define/lion-input-stepper.js';
import '@lion/ui/define/lion-input.js';
import '@lion/ui/define/lion-listbox.js';
import '@lion/ui/define/lion-radio-group.js';
import '@lion/ui/define/lion-radio.js';
import '@lion/ui/define/lion-select.js';
import '@lion/ui/define/lion-select-rich.js';
import '@lion/ui/define/lion-switch.js';
import '@lion/ui/define/lion-textarea.js';
import '@lion/ui/define/lion-button-submit.js';
import '@lion/ui/define/lion-button-reset.js';
import { MinLength, Required, Validator } from '@lion/ui/form-core.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
```

## Umbrella Form

```js preview-story
class AlwaysInvalid extends Validator {
  static validatorName = 'AlwaysInvalid';

  execute() {
    const showMessage = true;
    return showMessage;
  }
}

export const main = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-form>
      <form>
        <lion-input-datepicker
          name="datepicker"
          label="Date to be picked"
          .validators="${[new AlwaysInvalid()]}"
        ></lion-input-datepicker>
        <div class="buttons">
          <lion-button-submit>Submit</lion-button-submit>
          <lion-button-reset
            @click="${ev =>
              ev.currentTarget.parentElement.parentElement.parentElement.resetGroup()}"
            >Reset</lion-button-reset
          >
        </div>
      </form>
    </lion-form>
  `;
};
```
