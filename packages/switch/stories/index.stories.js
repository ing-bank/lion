import { storiesOf, html } from '@open-wc/demoing-storybook';
import { LitElement } from '@lion/core';

import { LocalizeMixin } from '@lion/localize';

import '../lion-input-switch.js';
import '../lion-button-switch.js';
import '@lion/form/lion-form.js';

storiesOf('Forms|Switch', module)
  .add(
    'All text slots',
    () => html`
      <lion-input-switch label="Label" help-text="Help text"> </lion-input-switch>
    `,
  )
  .add(
    'Disabled',
    () => html`
      <lion-input-switch label="Disabled label" disabled> </lion-input-switch>
    `,
  )
  .add('Validation', () => {
    const isTrue = value => value && value.checked && value.checked === true;
    const isTrueValidator = (...factoryParams) => [
      (...params) => ({
        isTrue: isTrue(...params),
      }),
      ...factoryParams,
    ];
    const tagName = 'lion-switch-validation-demo';
    if (!customElements.get(tagName)) {
      customElements.define(
        tagName,
        class extends LocalizeMixin(LitElement) {
          static get localizeNamespaces() {
            const result = [
              {
                'lion-validate+isTrue': () =>
                  Promise.resolve({
                    info: {
                      isTrue: 'You will not get the latest news!',
                    },
                  }),
              },
              ...super.localizeNamespaces,
            ];
            return result;
          }

          render() {
            return html`
              <lion-form id="postsForm" @submit="${this.submit}">
                <form>
                  <lion-input-switch name="emailAddress" label="Share email address">
                  </lion-input-switch>
                  <lion-input-switch name="subjectField" label="Show subject field" checked>
                  </lion-input-switch>
                  <lion-input-switch name="characterCount" label="Character count">
                  </lion-input-switch>
                  <lion-input-switch
                    name="newsletterCheck"
                    label="* Subscribe to newsletter"
                    .infoValidators="${[isTrueValidator()]}"
                  >
                  </lion-input-switch>
                  <button type="submit">
                    Submit
                  </button>
                </form>
              </lion-form>
            `;
          }

          submit() {
            const form = this.shadowRoot.querySelector('#postsForm');
            if (form.errorState === false) {
              console.log(form.serializeGroup());
            }
          }
        },
      );
    }
    return html`
      <lion-switch-validation-demo></lion-switch-validation-demo>
    `;
  })
  .add(
    'Button',
    () => html`
      <lion-button-switch></lion-button-switch>
    `,
  );
