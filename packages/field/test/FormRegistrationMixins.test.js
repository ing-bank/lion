import { expect, fixture, html, defineCE, unsafeStatic } from '@open-wc/testing';
import sinon from 'sinon';
import { LitElement, UpdatingElement } from '@lion/core';

import { FormRegisteringMixin } from '../src/FormRegisteringMixin.js';
import { FormRegistrarMixin } from '../src/FormRegistrarMixin.js';

describe('FormRegistrationMixins', () => {
  before(async () => {
    const FormRegistrarEl = class extends FormRegistrarMixin(UpdatingElement) {};
    customElements.define('form-registrar', FormRegistrarEl);
    const FormRegisteringEl = class extends FormRegisteringMixin(UpdatingElement) {};
    customElements.define('form-registering', FormRegisteringEl);
  });

  it('can register a formElement', async () => {
    const el = await fixture(html`
      <form-registrar>
        <form-registering></form-registering>
      </form-registrar>
    `);
    await el.registrationReady;
    expect(el.formElements.length).to.equal(1);
  });

  it('supports nested registrar', async () => {
    const el = await fixture(html`
      <form-registrar>
        <form-registrar>
          <form-registering></form-registering>
        </form-registrar>
      </form-registrar>
    `);
    await el.registrationReady;
    expect(el.formElements.length).to.equal(1);
    expect(el.querySelector('form-registrar').formElements.length).to.equal(1);
  });

  it('works for component that have a delayed render', async () => {
    const tagWrapperString = defineCE(
      class extends FormRegistrarMixin(LitElement) {
        async performUpdate() {
          await new Promise(resolve => setTimeout(() => resolve(), 10));
          await super.performUpdate();
        }

        render() {
          return html`
            <slot></slot>
          `;
        }
      },
    );
    const tagWrapper = unsafeStatic(tagWrapperString);
    const registerSpy = sinon.spy();
    const el = await fixture(html`
      <${tagWrapper} @form-element-register=${registerSpy}>
        <form-registering></form-registering>
      </${tagWrapper}>
    `);
    await el.registrationReady;
    expect(el.formElements.length).to.equal(1);
  });

  it('requests update of the resetModelValue function of its parent formGroup', async () => {
    const ParentFormGroupClass = class extends FormRegistrarMixin(LitElement) {
      _updateResetModelValue() {
        this.resetModelValue = 'foo';
      }
    };
    const ChildFormGroupClass = class extends FormRegisteringMixin(LitElement) {
      constructor() {
        super();
        this.__parentFormGroup = this.parentNode;
      }
    };

    const parentClass = defineCE(ParentFormGroupClass);
    const formGroup = unsafeStatic(parentClass);
    const childClass = defineCE(ChildFormGroupClass);
    const childFormGroup = unsafeStatic(childClass);
    const parentFormEl = await fixture(html`
      <${formGroup}><${childFormGroup} id="child" name="child[]"></${childFormGroup}></${formGroup}>
    `);
    expect(parentFormEl.resetModelValue).to.equal('foo');
  });

  it('can dynamically add/remove elements', async () => {
    const el = await fixture(html`
      <form-registrar>
        <form-registering></form-registering>
      </form-registrar>
    `);
    const newField = await fixture(html`
      <form-registering></form-registering>
    `);

    expect(el.formElements.length).to.equal(1);

    el.appendChild(newField);
    expect(el.formElements.length).to.equal(2);

    el.removeChild(newField);
    expect(el.formElements.length).to.equal(1);
  });
});
