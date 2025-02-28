---
parts:
  - Form
  - Use Cases
title: 'Form: Use Cases'
eleventyNavigation:
  key: 'Form: Use Cases'
  order: 20
  parent: Form
  title: Use Cases
---
# Form: Use Cases

```js script
import { html as previewHtml } from '@mdjs/mdjs-preview';
import { Required } from '@lion/ui/form-core.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
import '@lion/ui/define/lion-fieldset.js';
import '@lion/ui/define/lion-input.js';
import '@lion/ui/define/lion-form.js';
```

## Submit & Reset

To submit a form, use a regular `<button>` (or `<lion-button-submit>`) somewhere inside the native `<form>`. Then, add a `submit` handler on the `<lion-form>`. You can use this event to do your own (pre-)submit logic, like getting the serialized form data and sending it to a backend API.

Another example is checking if the form has errors, and focusing the first field with a validation error.
To learn more about form validation, please take a look at [validate](../../fundamentals/systems/form/validate.md).

To fire a submit from JavaScript, select the `<lion-form>` element and call `.submit()`.

```js preview-story
export const formSubmit = () => {
  loadDefaultFeedbackMessages();
  const submitHandler = ev => {
    const formData = ev.target.serializedValue;
    console.log('formData', formData);
    if (!ev.target.hasFeedbackFor?.includes('error')) {
      fetch('/api/foo/', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
    }
  };
  const submitViaJS = ev => {
    // Call submit on the lion-form element, in your own code you should use
    // a selector that's not dependent on DOM structure like this one.
    ev.target.previousElementSibling.submit();
  };
  return html`
    <lion-form @submit="${submitHandler}">
      <form>
        <lion-input
          name="firstName"
          label="First Name"
          .validators="${[new Required()]}"
        ></lion-input>
        <lion-input
          name="lastName"
          label="Last Name"
          .validators="${[new Required()]}"
        ></lion-input>
        <div style="display:flex">
          <button>Submit</button>
          <button
            type="button"
            @click="${ev =>
              ev.currentTarget.parentElement.parentElement.parentElement.resetGroup()}"
          >
            Reset
          </button>
        </div>
      </form>
    </lion-form>
    <button @click="${submitViaJS}">Explicit submit via JavaScript</button>
  `;
};
```

## Prefilled data

It is possible to use data to prefill the form. This can be done via the `serializedValue` attribute.

```js preview-story
export const prefilledData = () => {
  loadDefaultFeedbackMessages();
  const submitHandler = ev => {
    const formData = ev.target.serializedValue;
    console.log('formData', formData);
    if (!ev.target.hasFeedbackFor?.includes('error')) {
      fetch('/api/foo/', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
    }
  };
  const serializedValue = {
    firstName: 'Foo',
    lastName: 'Bar',
  };
  return html`
    <lion-form @submit="${submitHandler}" .serializedValue="${serializedValue}">
      <form>
        <lion-input
          name="firstName"
          label="First Name"
          .validators="${[new Required()]}"
        ></lion-input>
        <lion-input
          name="lastName"
          label="Last Name"
          .validators="${[new Required()]}"
        ></lion-input>
        <div style="display:flex">
          <button>Submit</button>
          <button
            type="button"
            @click="${ev =>
              ev.currentTarget.parentElement.parentElement.parentElement.resetGroup()}"
          >
            Reset
          </button>
        </div>
      </form>
    </lion-form>
  `;
};
```

Learn more about [formatting and parsing](../../fundamentals/systems/form/formatting-and-parsing.md).

## Sub forms

To create sections inside a form you can make use of fieldsets.

In some cases you want to create a reusable sub-form component. Since all form elements need to be in the light DOM, to be accessible, the sub-form needs to be in the light DOM too. To do this you'll need to make use of the `SlotMixin`.

```js preview-story
import { html, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { SlotMixin } from '@lion/ui/core.js';
import { Required as _Required } from '@lion/ui/form-core.js';
import { LionFieldset } from '@lion/ui/fieldset.js';
import { LionInput } from '@lion/ui/input.js';

class SubFormAddress extends SlotMixin(ScopedElementsMixin(LitElement)) {
  static get scopedElements() {
    return {
      'lion-fieldset': LionFieldset,
      'lion-input': LionInput,
    };
  }

  get slots() {
    return {
      ...super.slots,
      '': () => ({
        template: this.#renderInSlot(),
      }),
    };
  }

  render() {
    return html` <slot></slot> `;
  }

  /**
   * @private
   */
  #renderInSlot() {
    return html`
      <lion-fieldset name="address" label="Address">
        <lion-input name="street" label="Street" .validators="${[new _Required()]}"></lion-input>
        <lion-input name="number" label="Number" .validators="${[new _Required()]}"></lion-input>
        <lion-input
          name="postalCode"
          label="Postal code"
          .validators="${[new _Required()]}"
        ></lion-input>
      </lion-fieldset>
    `;
  }
}

customElements.define('sub-form-address', SubFormAddress);

export const subForms = () => {
  loadDefaultFeedbackMessages();
  const submitHandler = ev => {
    const formData = ev.target.serializedValue;
    console.log('formData', formData);
    if (!ev.target.hasFeedbackFor?.includes('error')) {
      fetch('/api/foo/', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
    }
  };
  return html`
    <lion-form @submit="${submitHandler}">
      <form>
        <lion-fieldset name="fullName" label="Name">
          <lion-input
            name="firstName"
            label="First Name"
            .validators="${[new Required()]}"
          ></lion-input>
          <lion-input
            name="lastName"
            label="Last Name"
            .validators="${[new Required()]}"
          ></lion-input>
        </lion-fieldset>
        <sub-form-address></sub-form-address>
        <div style="display:flex">
          <button>Submit</button>
          <button
            type="button"
            @click="${ev =>
              ev.currentTarget.parentElement.parentElement.parentElement.resetGroup()}"
          >
            Reset
          </button>
        </div>
      </form>
    </lion-form>
  `;
};
```
