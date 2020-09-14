import { expect, html, defineCE, unsafeStatic, fixture } from '@open-wc/testing';
import { LitElement } from '@lion/core';
import sinon from 'sinon';
import { FormControlMixin } from '../src/FormControlMixin.js';
import { FormRegistrarMixin } from '../src/registration/FormRegistrarMixin.js';

describe('FormControlMixin', () => {
  const inputSlot = '<input slot="input" />';

  // @ts-expect-error base constructor same return type
  class FormControlMixinClass extends FormControlMixin(LitElement) {}

  const tagString = defineCE(FormControlMixinClass);
  const tag = unsafeStatic(tagString);

  it('has a label', async () => {
    const elAttr = /** @type {FormControlMixinClass} */ (await fixture(html`
      <${tag} label="Email address">${inputSlot}</${tag}>
    `));

    expect(elAttr.label).to.equal('Email address', 'as an attribute');

    const elProp = /** @type {FormControlMixinClass} */ (await fixture(html`
      <${tag}
        .label=${'Email address'}
      >${inputSlot}
      </${tag}>`));
    expect(elProp.label).to.equal('Email address', 'as a property');

    const elElem = /** @type {FormControlMixinClass} */ (await fixture(html`
      <${tag}>
        <label slot="label">Email address</label>
        ${inputSlot}
      </${tag}>`));
    expect(elElem.label).to.equal('Email address', 'as an element');
  });

  it('is hidden when attribute hidden is true', async () => {
    const el = await fixture(html`
    <${tag} hidden>
    <label slot="label">Email <span>address</span></label>
        ${inputSlot}
    </${tag}>`);
    expect(el).not.to.be.displayed;
  });

  it('has a label that supports inner html', async () => {
    const el = /** @type {FormControlMixinClass} */ (await fixture(html`
      <${tag}>
        <label slot="label">Email <span>address</span></label>
        ${inputSlot}
      </${tag}>`));
    expect(el.label).to.equal('Email address');
  });

  it('only takes label of direct child', async () => {
    const el = /** @type {FormControlMixinClass} */ (await fixture(html`
      <${tag}>
        <${tag} label="Email address">
          ${inputSlot}
        </${tag}>
      </${tag}>`));
    expect(el.label).to.equal('');
  });

  it('can have a help-text', async () => {
    const elAttr = /** @type {FormControlMixinClass} */ (await fixture(html`
      <${tag} help-text="We will not send you any spam">${inputSlot}</${tag}>
    `));
    expect(elAttr.helpText).to.equal('We will not send you any spam', 'as an attribute');

    const elProp = /** @type {FormControlMixinClass} */ (await fixture(html`
      <${tag}
        .helpText=${'We will not send you any spam'}
      >${inputSlot}
      </${tag}>`));
    expect(elProp.helpText).to.equal('We will not send you any spam', 'as a property');

    const elElem = /** @type {FormControlMixinClass} */ (await fixture(html`
      <${tag}>
        <div slot="help-text">We will not send you any spam</div>
        ${inputSlot}
      </${tag}>`));
    expect(elElem.helpText).to.equal('We will not send you any spam', 'as an element');
  });

  it('can have a help-text that supports inner html', async () => {
    const el = /** @type {FormControlMixinClass} */ (await fixture(html`
      <${tag}>
        <div slot="help-text">We will not send you any <span>spam</span></div>
        ${inputSlot}
      </${tag}>`));
    expect(el.helpText).to.equal('We will not send you any spam');
  });

  it('only takes help-text of direct child', async () => {
    const el = /** @type {FormControlMixinClass} */ (await fixture(html`
      <${tag}>
        <${tag} help-text="We will not send you any spam">
          ${inputSlot}
        </${tag}>
      </${tag}>`));
    expect(el.helpText).to.equal('');
  });

  it('does not duplicate aria-describedby and aria-labelledby ids', async () => {
    const lionField = /** @type {FormControlMixinClass} */ (await fixture(`
      <${tagString} help-text="This element will be disconnected/reconnected">${inputSlot}</${tagString}>
    `));

    const wrapper = /** @type {LitElement} */ (await fixture(`<div></div>`));
    lionField.parentElement?.appendChild(wrapper);
    wrapper.appendChild(lionField);
    await wrapper.updateComplete;

    ['aria-describedby', 'aria-labelledby'].forEach(ariaAttributeName => {
      const ariaAttribute = Array.from(lionField.children)
        .find(child => child.slot === 'input')
        ?.getAttribute(ariaAttributeName)
        ?.trim()
        .split(' ');
      const hasDuplicate = !!ariaAttribute?.find((el, i) => ariaAttribute.indexOf(el) !== i);
      expect(hasDuplicate).to.be.false;
    });
  });

  // FIXME: Broken test
  it.skip('internally sorts aria-describedby and aria-labelledby ids', async () => {
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
    const el = /** @type {FormControlMixinClass} */ (wrapper.querySelector(tagString));
    const { _inputNode } = el;

    // 1. addToAriaLabelledBy()
    // external inputs should go in order defined by user
    const labelA = /** @type {HTMLElement} */ (wrapper.querySelector('#additionalLabelA'));
    const labelB = /** @type {HTMLElement} */ (wrapper.querySelector('#additionalLabelB'));
    el.addToAriaLabelledBy(labelA);
    el.addToAriaLabelledBy(labelB);

    const ariaLabelId = /** @type {number} */ (_inputNode
      .getAttribute('aria-labelledby')
      ?.indexOf(`label-${el._inputId}`));

    const ariaLabelA = /** @type {number} */ (_inputNode
      .getAttribute('aria-labelledby')
      ?.indexOf('additionalLabelA'));

    const ariaLabelB = /** @type {number} */ (_inputNode
      .getAttribute('aria-labelledby')
      ?.indexOf('additionalLabelB'));

    expect(ariaLabelId < ariaLabelB && ariaLabelB < ariaLabelA).to.be.true;

    // 2. addToAriaDescribedBy()
    // Check if the aria attr is filled initially
    const descA = /** @type {HTMLElement} */ (wrapper.querySelector('#additionalDescriptionA'));
    const descB = /** @type {HTMLElement} */ (wrapper.querySelector('#additionalDescriptionB'));
    el.addToAriaDescribedBy(descB);
    el.addToAriaDescribedBy(descA);

    const ariaDescId = /** @type {number} */ (_inputNode
      .getAttribute('aria-describedby')
      ?.indexOf(`feedback-${el._inputId}`));

    const ariaDescA = /** @type {number} */ (_inputNode
      .getAttribute('aria-describedby')
      ?.indexOf('additionalDescriptionA'));

    const ariaDescB = /** @type {number} */ (_inputNode
      .getAttribute('aria-describedby')
      ?.indexOf('additionalDescriptionB'));

    // Should be placed in the end
    expect(ariaDescId < ariaDescB && ariaDescB < ariaDescA).to.be.true;
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
        ?.getAttribute('aria-live'),
    ).to.equal('polite');
  });

  describe('Model-value-changed event propagation', () => {
    // @ts-expect-error base constructor same return type
    const FormControlWithRegistrarMixinClass = class extends FormControlMixin(
      FormRegistrarMixin(LitElement),
    ) {};

    const groupElem = defineCE(FormControlWithRegistrarMixinClass);
    const groupTag = unsafeStatic(groupElem);

    describe('On initialization', () => {
      it('redispatches one event from host', async () => {
        const formSpy = sinon.spy();
        const fieldsetSpy = sinon.spy();
        const formEl = /** @type {FormControlMixinClass} */ (await fixture(html`
          <${groupTag} name="form" ._repropagationRole=${'form-group'} @model-value-changed=${formSpy}>
            <${groupTag} name="fieldset" ._repropagationRole=${'form-group'} @model-value-changed=${fieldsetSpy}>
              <${tag} name="field"></${tag}>
            </${groupTag}>
          </${groupTag}>
        `));
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
        fieldsetEl?.addEventListener('model-value-changed', fieldsetSpy);
        fieldEl?.addEventListener('model-value-changed', fieldSpy);

        fieldEl?.dispatchEvent(new Event('model-value-changed', { bubbles: true }));

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
        /** @typedef {{ checked: boolean }} checkedInterface */
        const option1El = /** @type {HTMLElement & checkedInterface} */ (formEl.querySelector(
          '#option1',
        ));
        const option2El = /** @type {HTMLElement & checkedInterface} */ (formEl.querySelector(
          '#option2',
        ));
        formEl.addEventListener('model-value-changed', formSpy);
        choiceGroupEl?.addEventListener('model-value-changed', choiceGroupSpy);

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
