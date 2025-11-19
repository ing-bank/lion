/** script code **/
import { html as previewHtml } from '@mdjs/mdjs-preview';
import { Required } from '@lion/ui/form-core.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
import '@lion/ui/define/lion-fieldset.js';
import '@lion/ui/define/lion-input.js';
import '@lion/ui/define/lion-form.js';
/** stories code **/
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
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'formSubmit', story: formSubmit }, { key: 'prefilledData', story: prefilledData }, { key: 'subForms', story: subForms }];
let needsMdjsElements = false;
for (const story of stories) {
  const storyEl = rootNode.querySelector(`[mdjs-story-name="${story.key}"]`);
  if (storyEl) {
    storyEl.story = story.story;
    storyEl.key = story.key;
    needsMdjsElements = true;
    Object.assign(storyEl, {"simulatorUrl":"/next/simulator/","languages":[{"key":"de-DE","name":"German"},{"key":"en-GB","name":"English (United Kingdom)"},{"key":"en-US","name":"English (United States)"},{"key":"nl-NL","name":"Dutch"}]});
  }
};
if (needsMdjsElements) {
  if (!customElements.get('mdjs-preview')) { import('/node_modules/@mdjs/mdjs-preview/src/define/define.js'); }
  if (!customElements.get('mdjs-story')) { import('/node_modules/@mdjs/mdjs-story/src/define.js'); }
}