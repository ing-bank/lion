import { expect, html, defineCE, unsafeStatic } from '@open-wc/testing';
import { LitElement, SlotMixin } from '@lion/core';
import sinon from 'sinon';
import { formFixture as fixture } from '../test-helpers/formFixture.js';
import { FormControlMixin } from '../src/FormControlMixin.js';
import { FormRegistrarMixin } from '../src/registration/FormRegistrarMixin.js';

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

  it('has a label', async () => {
    const elAttr = await fixture(html`
      <${tag} label="Email address">${inputSlot}</${tag}>
    `);
    expect(elAttr.label).to.equal('Email address', 'as an attribute');

    const elProp = await fixture(html`
      <${tag}
        .label=${'Email address'}
      >${inputSlot}
      </${tag}>`);
    expect(elProp.label).to.equal('Email address', 'as a property');

    const elElem = await fixture(html`
      <${tag}>
        <label slot="label">Email address</label>
        ${inputSlot}
      </${tag}>`);
    expect(elElem.label).to.equal('Email address', 'as an element');
  });

  it('has a label that supports inner html', async () => {
    const el = await fixture(html`
      <${tag}>
        <label slot="label">Email <span>address</span></label>
        ${inputSlot}
      </${tag}>`);
    expect(el.label).to.equal('Email address');
  });

  it('only takes label of direct child', async () => {
    const el = await fixture(html`
      <${tag}>
        <${tag} label="Email address">
          ${inputSlot}
        </${tag}>
      </${tag}>`);
    expect(el.label).to.equal('');
  });

  it('can have a help-text', async () => {
    const elAttr = await fixture(html`
      <${tag} help-text="We will not send you any spam">${inputSlot}</${tag}>
    `);
    expect(elAttr.helpText).to.equal('We will not send you any spam', 'as an attribute');

    const elProp = await fixture(html`
      <${tag}
        .helpText=${'We will not send you any spam'}
      >${inputSlot}
      </${tag}>`);
    expect(elProp.helpText).to.equal('We will not send you any spam', 'as a property');

    const elElem = await fixture(html`
      <${tag}>
        <div slot="help-text">We will not send you any spam</div>
        ${inputSlot}
      </${tag}>`);
    expect(elElem.helpText).to.equal('We will not send you any spam', 'as an element');
  });

  it('can have a help-text that supports inner html', async () => {
    const el = await fixture(html`
      <${tag}>
        <div slot="help-text">We will not send you any <span>spam</span></div>
        ${inputSlot}
      </${tag}>`);
    expect(el.helpText).to.equal('We will not send you any spam');
  });

  it('only takes help-text of direct child', async () => {
    const el = await fixture(html`
      <${tag}>
        <${tag} help-text="We will not send you any spam">
          ${inputSlot}
        </${tag}>
      </${tag}>`);
    expect(el.helpText).to.equal('');
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

  describe('Model-value-changed event propagation', () => {
    const FormControlWithRegistrarMixinClass = class extends FormControlMixin(
      FormRegistrarMixin(SlotMixin(LitElement)),
    ) {
      static get properties() {
        return {
          modelValue: {
            type: String,
          },
        };
      }
    };

    const groupElem = defineCE(FormControlWithRegistrarMixinClass);
    const groupTag = unsafeStatic(groupElem);

    describe('On initialization', () => {
      it('redispatches one event from host', async () => {
        const formSpy = sinon.spy();
        const fieldsetSpy = sinon.spy();
        const formEl = await fixture(html`
          <${groupTag} name="form" ._repropagationRole=${'form-group'} @model-value-changed=${formSpy}>
            <${groupTag} name="fieldset" ._repropagationRole=${'form-group'} @model-value-changed=${fieldsetSpy}>
              <${tag} name="field"></${tag}>
            </${groupTag}>
          </${groupTag}>
        `);
        const fieldsetEl = formEl.querySelector('[name=fieldset]');

        expect(fieldsetSpy.callCount).to.equal(1);
        const fieldsetEv = fieldsetSpy.firstCall.args[0];
        expect(fieldsetEv.target).to.equal(fieldsetEl);
        expect(fieldsetEv.detail.formPath).to.eql([fieldsetEl]);

        expect(formSpy.callCount).to.equal(1);
        const formEv = formSpy.firstCall.args[0];
        expect(formEv.target).to.equal(formEl);
        expect(formEv.detail.formPath).to.eql([formEl]);
      });
    });

    describe('After initialization', () => {
      it('redispatches one event from host and keeps formPath history', async () => {
        const formSpy = sinon.spy();
        const fieldsetSpy = sinon.spy();
        const fieldSpy = sinon.spy();
        const formEl = await fixture(html`
          <${groupTag} name="form">
            <${groupTag} name="fieldset">
              <${tag} name="field"></${tag}>
            </${groupTag}>
          </${groupTag}>
        `);
        const fieldEl = formEl.querySelector('[name=field]');
        const fieldsetEl = formEl.querySelector('[name=fieldset]');

        formEl.addEventListener('model-value-changed', formSpy);
        fieldsetEl.addEventListener('model-value-changed', fieldsetSpy);
        fieldEl.addEventListener('model-value-changed', fieldSpy);

        fieldEl.dispatchEvent(new Event('model-value-changed', { bubbles: true }));

        expect(fieldsetSpy.callCount).to.equal(1);
        const fieldsetEv = fieldsetSpy.firstCall.args[0];
        expect(fieldsetEv.target).to.equal(fieldsetEl);
        expect(fieldsetEv.detail.formPath).to.eql([fieldEl, fieldsetEl]);

        expect(formSpy.callCount).to.equal(1);
        const formEv = formSpy.firstCall.args[0];
        expect(formEv.target).to.equal(formEl);
        expect(formEv.detail.formPath).to.eql([fieldEl, fieldsetEl, formEl]);
      });

      it('sends one event for single select choice-groups', async () => {
        const formSpy = sinon.spy();
        const choiceGroupSpy = sinon.spy();
        const formEl = await fixture(html`
          <${groupTag} name="form">
            <${groupTag} name="choice-group" ._repropagationRole=${'choice-group'}>
              <${tag} name="choice-group" id="option1" .checked=${true}></${tag}>
              <${tag} name="choice-group" id="option2"></${tag}>
            </${groupTag}>
          </${groupTag}>
        `);
        const choiceGroupEl = formEl.querySelector('[name=choice-group]');
        const option1El = formEl.querySelector('#option1');
        const option2El = formEl.querySelector('#option2');
        formEl.addEventListener('model-value-changed', formSpy);
        choiceGroupEl.addEventListener('model-value-changed', choiceGroupSpy);

        // Simulate check
        option2El.checked = true;
        option2El.dispatchEvent(new Event('model-value-changed', { bubbles: true }));
        option1El.checked = false;
        option1El.dispatchEvent(new Event('model-value-changed', { bubbles: true }));

        expect(choiceGroupSpy.callCount).to.equal(1);
        const choiceGroupEv = choiceGroupSpy.firstCall.args[0];
        expect(choiceGroupEv.target).to.equal(choiceGroupEl);
        expect(choiceGroupEv.detail.formPath).to.eql([choiceGroupEl]);

        expect(formSpy.callCount).to.equal(1);
        const formEv = formSpy.firstCall.args[0];
        expect(formEv.target).to.equal(formEl);
        expect(formEv.detail.formPath).to.eql([choiceGroupEl, formEl]);
      });
    });
  });
});
