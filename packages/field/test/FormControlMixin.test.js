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
    expect(
      Array.from(lionFieldAttr.children).find(child => child.slot === 'help-text').textContent,
    ).to.contain('This email address is already taken');
    const lionFieldProp = await fixture(html`
      <${tag}
        .helpText=${'This email address is already taken'}
      >${inputSlot}
      </${tag}>`);

    expect(
      Array.from(lionFieldProp.children).find(child => child.slot === 'help-text').textContent,
    ).to.contain('This email address is already taken');
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
      const ariaAttribute = Array.from(lionField.children)
        .find(child => child.slot === 'input')
        .getAttribute(ariaAttributeName)
        .trim()
        .split(' ');
      const hasDuplicate = !!ariaAttribute.find((el, i) => ariaAttribute.indexOf(el) !== i);
      expect(hasDuplicate).to.be.false;
    });
  });

  it('internally sorts aria-describedby and aria-labelledby ids', async () => {
    const wrapper = await fixture(html`
      <div id="wrapper">
        <div id="additionalLabelA">should go after input internals</div>
        <div id="additionalDescriptionA">should go after input internals</div>
        <${tag}>
          <input slot="input" />
          <label slot="label">Added to label by default</label>
          <div slot="feedback">Added to description by default</div>
        </${tag}>
        <div id="additionalLabelB">should go after input internals</div>
        <div id="additionalDescriptionB">should go after input internals</div>
      </div>`);
    const el = wrapper.querySelector(elem);

    const { _inputNode } = el;

    // 1. addToAriaLabelledBy()
    // external inputs should go in order defined by user
    el.addToAriaLabelledBy(wrapper.querySelector('#additionalLabelB'));
    el.addToAriaLabelledBy(wrapper.querySelector('#additionalLabelA'));

    expect(
      _inputNode.getAttribute('aria-labelledby').indexOf(`label-${el._inputId}`) <
        _inputNode.getAttribute('aria-labelledby').indexOf('additionalLabelB') <
        _inputNode.getAttribute('aria-labelledby').indexOf('additionalLabelA'),
    );

    // 2. addToAriaDescribedBy()
    // Check if the aria attr is filled initially
    el.addToAriaDescribedBy(wrapper.querySelector('#additionalDescriptionB'));
    el.addToAriaDescribedBy(wrapper.querySelector('#additionalDescriptionA'));

    // Should be placed in the end
    expect(
      _inputNode.getAttribute('aria-describedby').indexOf(`feedback-${el._inputId}`) <
        _inputNode.getAttribute('aria-describedby').indexOf('additionalDescriptionB') <
        _inputNode.getAttribute('aria-describedby').indexOf('additionalDescriptionA'),
    );
  });

  it('adds aria-live="polite" to the feedback slot', async () => {
    const lionField = await fixture(html`
      <${tag}>
        ${inputSlot}
        <div slot="feedback">Added to see attributes</div>
      </${tag}>
    `);

    expect(
      Array.from(lionField.children)
        .find(child => child.slot === 'feedback')
        .getAttribute('aria-live'),
    ).to.equal('polite');
  });
});
