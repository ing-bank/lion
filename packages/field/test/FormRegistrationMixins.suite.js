import { expect, fixture, html, defineCE, unsafeStatic } from '@open-wc/testing';
import { LitElement } from '@lion/core';

import { RegistrationParentMixin } from '../src/registration/RegistrationParentMixin.js';
import { RegistrationChildMixin } from '../src/registration/RegistrationChildMixin.js';
import { LitPatchShadyMixin } from '../src/registration/LitPatchShadyMixin.js';

function printSuffix(suffix) {
  return suffix ? ` (${suffix})` : '';
}

export const runRegistrationSuite = customConfig => {
  const cfg = {
    baseElement: HTMLElement,
    suffix: null,
    parentTagString: null,
    childTagString: null,
    parentMixin: RegistrationParentMixin,
    childMixin: RegistrationChildMixin,
    ...customConfig,
  };

  let parentTag;
  let childTag;

  describe.only(`FormRegistrationMixins${printSuffix(cfg.suffix)}`, () => {
    before(async () => {
      if (!cfg.parentTagString) {
        cfg.parentTagString = defineCE(class extends cfg.parentMixin(cfg.baseElement) {});
      }
      if (!cfg.childTagString) {
        cfg.childTagString = defineCE(class extends cfg.childMixin(cfg.baseElement) {});
      }

      parentTag = unsafeStatic(cfg.parentTagString);
      childTag = unsafeStatic(cfg.childTagString);
    });

    it('can register a formElement', async () => {
      const el = await fixture(html`
        <${parentTag}>
          <${childTag}></${childTag}>
        </${parentTag}>
      `);
      await el.registrationReady;
      expect(el.formElements.length).to.equal(1);
    });

    it('supports nested registrar', async () => {
      const el = await fixture(html`
        <${parentTag}>
          <${parentTag}>
            <${childTag}></${childTag}>
          </${parentTag}>
        </${parentTag}>
      `);
      await el.registrationReady;
      expect(el.formElements.length).to.equal(1);
      expect(el.querySelector(cfg.parentTagString).formElements.length).to.equal(1);
    });

    it('works for component that have a delayed render', async () => {
      const tagWrapperString = defineCE(
        class extends cfg.parentMixin(LitPatchShadyMixin(LitElement)) {
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
      // const registerSpy = sinon.spy();
      const el = await fixture(html`
        <${tagWrapper}>
          <${childTag}></${childTag}>
        </${tagWrapper}>
      `);
      await el.registrationReady;
      expect(el.formElements.length).to.equal(1);
    });

    // TODO: create registration hooks so this logic can be put along reset logic
    it.skip('requests update of the resetModelValue function of its parent formGroup', async () => {
      const ParentFormGroupClass = class extends RegistrationParentMixin(LitElement) {
        _updateResetModelValue() {
          this.resetModelValue = 'foo';
        }
      };
      const ChildFormGroupClass = class extends RegistrationChildMixin(LitElement) {
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
        <${parentTag}>
          <${childTag}></${childTag}>
        </${parentTag}>
      `);
      const newField = await fixture(html`
        <${childTag}></${childTag}>
      `);

      expect(el.formElements.length).to.equal(1);

      el.appendChild(newField);
      expect(el.formElements.length).to.equal(2);

      el.removeChild(newField);
      expect(el.formElements.length).to.equal(1);
    });
  });
};
