import { expect, fixture, html, defineCE, unsafeStatic } from '@open-wc/testing';
import { LitElement, SlotMixin } from '@lion/core';

import { FormControlMixin } from '../src/FormControlMixin.js';

describe('FormControlMixin', () => {
  const inputSlot = '<input slot="input" />';
  let elem;
  let tag;

  before(async () => {
    const FormControlMixinClass = class extends FormControlMixin(SlotMixin(LitElement)) {
      static get properties() {
        return {
          modelValue: {
            type: String,
          },
        };
      }
    };

    elem = defineCE(FormControlMixinClass);
    tag = unsafeStatic(elem);
  });

  it('has the capability to override the help text', async () => {
    const lionFieldAttr = await fixture(html`
      <${tag} help-text="This email address is already taken">${inputSlot}</${tag}>
    `);
    expect(lionFieldAttr.querySelector('[slot=help-text]').textContent).to.contain(
      'This email address is already taken',
    );
    const lionFieldProp = await fixture(html`
      <${tag}
        .helpText=${'This email address is already taken'}
      >${inputSlot}
      </${tag}>`);

    expect(lionFieldProp.querySelector('[slot=help-text]').textContent).to.contain(
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
        .querySelector('[slot=input]')
        .getAttribute(ariaAttributeName)
        .trim()
        .split(' ');
      const hasDuplicate = !!ariaAttribute.find((el, i) => ariaAttribute.indexOf(el) !== i);
      expect(hasDuplicate).to.be.false;
    });
  });

  it('adds aria-live="politie" to the feedback slot', async () => {
    const lionField = await fixture(html`
      <${tag}>
        ${inputSlot}
        <div slot="feedback">Added to see attributes</div>
      </${tag}>
    `);

    expect(lionField.querySelector('[slot=feedback]').getAttribute('aria-live')).to.equal('polite');
  });
});
