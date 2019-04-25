/* eslint-disable class-methods-use-this, no-underscore-dangle, no-unused-expressions */
import { expect, fixture, html, defineCE, unsafeStatic, nextFrame } from '@open-wc/testing';
import sinon from 'sinon';
import { SlotMixin } from '@lion/core';
import { LionLitElement } from '@lion/core/src/LionLitElement.js';

import { FormControlMixin } from '../src/FormControlMixin.js';

describe('FormControlMixin', () => {
  const inputSlot = '<input slot="input" />';
  let elem;
  let tag;

  before(async () => {
    // eslint-disable-next-line max-len
    const FormControlMixinClass = class extends FormControlMixin(SlotMixin(LionLitElement)) {
      static get properties() {
        return {
          ...super.properties,
          modelValue: {
            type: String,
          },
        };
      }
    };

    elem = defineCE(FormControlMixinClass);
    tag = unsafeStatic(elem);
  });

  it('dispatches event to register in Light DOM', async () => {
    const registerSpy = sinon.spy();
    await fixture(html`
      <div @form-element-register=${registerSpy}>
        <${tag}></${tag}>
      </div>
    `);
    await nextFrame();
    expect(registerSpy.callCount).to.equal(1);
  });

  it('can by caught by listening in the appropriate dom', async () => {
    const registerSpy = sinon.spy();
    const testTag = unsafeStatic(
      defineCE(
        class extends LionLitElement {
          connectedCallback() {
            super.connectedCallback();
            this.shadowRoot.addEventListener('form-element-register', registerSpy);
          }

          render() {
            return html`
              <${tag}></${tag}>
            `;
          }
        },
      ),
    );
    await fixture(html`
      <${testTag}></${testTag}>
    `);
    await nextFrame();
    expect(registerSpy.callCount).to.equal(1);
  });

  it('has the capability to override the help text', async () => {
    const lionFieldAttr = await fixture(html`
      <${tag} help-text="This email address is already taken">${inputSlot}</${tag}>
    `);
    expect(lionFieldAttr.$$slot('help-text').textContent).to.contain(
      'This email address is already taken',
    );
    const lionFieldProp = await fixture(html`
      <${tag}
        .helpText=${'This email address is already taken'}
      >${inputSlot}
      </${tag}>`);

    expect(lionFieldProp.$$slot('help-text').textContent).to.contain(
      'This email address is already taken',
    );
  });

  it('does not duplicate aria-describedby and aria-labelledby ids', async () => {
    const lionField = await fixture(`
      <${elem} help-text="This element will be disconnected/reconnected">${inputSlot}</${elem}>
    `);

    const wrapper = await fixture(`<div></div>`);
    lionField.parentElement.appendChild(wrapper);
    wrapper.appendChild(lionField);
    await wrapper.updateComplete;

    ['aria-describedby', 'aria-labelledby'].forEach(ariaAttributeName => {
      const ariaAttribute = lionField
        .$$slot('input')
        .getAttribute(ariaAttributeName)
        .trim()
        .split(' ');
      const hasDuplicate = !!ariaAttribute.find((el, i) => ariaAttribute.indexOf(el) !== i);
      expect(hasDuplicate).to.be.false;
    });
  });
});
