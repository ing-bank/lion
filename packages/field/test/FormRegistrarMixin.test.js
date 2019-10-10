import { fixture, html, expect } from '@open-wc/testing';
import { cache, LitElement } from '@lion/core';
import { LionFieldset } from '../../fieldset/src/LionFieldset.js';
import { FormRegistrarMixin } from '../src/FormRegistrarMixin.js';

describe.only('FormRegistrarMixin', () => {
  before(async () => {
    const FormRegistrarMixinClass = class extends FormRegistrarMixin(LionFieldset) {
      static get properties() {
        return {
          modelValue: {
            type: String,
          },
        };
      }
    };
    customElements.define('test-registrar', FormRegistrarMixinClass);

    const ContainerClass = class extends LitElement {
      static get properties() {
        return {
          hide: Boolean,
        };
      }

      render() {
        if (this.hide === true) {
          return html``;
        }
        return html`
          ${cache(
            html`
              <test-registrar></test-registrar>
            `,
          )}
        `;
      }
    };
    customElements.define('test-container', ContainerClass);
  });

  it('has the capability to override the help text', async () => {
    const element = await fixture(
      html`
        <test-container></test-container>
      `,
    );
    const child = await fixture(
      html`
        <child-element .name=${'form-element'}></child-element>
      `,
    );
    await element.updateComplete;
    const registrar = () => element.shadowRoot.querySelector('test-registrar');
    registrar().addFormElement(child);

    expect(Object.keys(registrar().formElements).length).to.be.equal(1);

    element.hide = true;
    await element.updateComplete;
    element.hide = false;
    await element.updateComplete;
    await new Promise(resolve =>
      setTimeout(() => {
        resolve();
      }, 1500),
    );

    expect(Object.keys(registrar().formElements).length).to.be.equal(1);
  });
});
