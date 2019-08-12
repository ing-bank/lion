import { expect, fixture, html, defineCE, unsafeStatic } from '@open-wc/testing';
import { LitElement } from '@lion/core';

import { RegistrationParentMixin } from '../src/registration/RegistrationParentMixin.js';
import { RegistrationChildMixin } from '../src/registration/RegistrationChildMixin.js';

export const runRegistrationSuite = customConfig => {
  const cfg = {
    baseElement: HTMLElement,
    suffix: null,
    parentTagString: null,
    childTagString: null,
    ...customConfig,
  };

  describe(`FormRegistrationMixins${cfg.suffix ? ` (${cfg.suffix})` : ''}`, () => {
    let parentTag;
    let childTag;

    before(async () => {
      if (!cfg.parentTagString) {
        cfg.parentTagString = defineCE(class extends RegistrationParentMixin(cfg.baseElement) {});
      }
      if (!cfg.childTagString) {
        cfg.childTagString = defineCE(class extends RegistrationChildMixin(cfg.baseElement) {});
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

    it('supports nested registration parents', async () => {
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

    it('works for components that have a delayed render', async () => {
      const tagWrapperString = defineCE(
        class extends RegistrationParentMixin(LitElement) {
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
      const el = await fixture(html`
        <${tagWrapper}>
          <${childTag}></${childTag}>
        </${tagWrapper}>
      `);
      await el.registrationReady;
      expect(el.formElements.length).to.equal(1);
    });

    // TODO: create registration hooks so this logic can be put along reset logic
    it('requests update of the resetModelValue function of its parent formGroup', async () => {
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

      const formGroupTag = unsafeStatic(defineCE(ParentFormGroupClass));
      const childFormGroupTag = unsafeStatic(defineCE(ChildFormGroupClass));
      const parentFormEl = await fixture(html`
        <${formGroupTag}>
          <${childFormGroupTag} id="child" name="child[]">
          </${childFormGroupTag}>
        </${formGroupTag}>
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

    describe('Unregister', () => {
      it('requests update of the resetModelValue function of its parent formGroup on unregister', async () => {
        const ParentFormGroupClass = class extends RegistrationParentMixin(LitElement) {
          _updateResetModelValue() {
            this.resetModelValue = this.formElements.length;
          }
        };
        const ChildFormGroupClass = class extends RegistrationChildMixin(LitElement) {
          constructor() {
            super();
            this.__parentFormGroup = this.parentNode;
          }
        };

        const formGroupTag = unsafeStatic(defineCE(ParentFormGroupClass));
        const childFormGroupTag = unsafeStatic(defineCE(ChildFormGroupClass));
        const parentFormEl = await fixture(html`
          <${formGroupTag}>
            <${childFormGroupTag} name="child[]"></${childFormGroupTag}>
            <${childFormGroupTag} name="child[]"></${childFormGroupTag}>
          </${formGroupTag}>
        `);
        expect(parentFormEl.resetModelValue).to.equal(2);
        parentFormEl.children[0].remove();
        expect(parentFormEl.resetModelValue).to.equal(1);
      });
    });
  });
};
