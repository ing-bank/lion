import { storiesOf, html } from '@open-wc/demoing-storybook';
import { LitElement } from '@lion/core';

import { LocalizeMixin } from '@lion/localize';

import '../lion-switch.js';
import '../lion-switch-button.js';
import '@lion/form/lion-form.js';

storiesOf('Buttons|Switch', module)
  .add(
    'Button',
    () => html`
      <lion-switch-button aria-label="Toggle button"></lion-switch-button>
    `,
  )
  .add(
    'Disabled',
    () => html`
      <lion-switch-button aria-label="Toggle button" disabled></lion-switch-button>
    `,
  )
  .add(
    'With input slots',
    () => html`
      <lion-switch label="Label" help-text="Help text"></lion-switch>
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
                  <lion-switch name="emailAddress" label="Share email address"> </lion-switch>
                  <lion-switch name="subjectField" label="Show subject field" checked>
                  </lion-switch>
                  <lion-switch name="characterCount" label="Character count"> </lion-switch>
                  <lion-switch
                    name="newsletterCheck"
                    label="* Subscribe to newsletter"
                    .infoValidators="${[isTrueValidator()]}"
                  >
                  </lion-switch>
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
  });
