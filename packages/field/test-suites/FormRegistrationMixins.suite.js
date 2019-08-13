import { expect, fixture, html, defineCE, unsafeStatic } from '@open-wc/testing';
import { LitElement } from '@lion/core';

import { FormRegistrarMixin } from '../src/FormRegistrarMixin.js';
import { FormRegisteringMixin } from '../src/FormRegisteringMixin.js';
import { formRegistrarManager } from '../src/formRegistrarManager.js';

export const runRegistrationSuite = customConfig => {
  const cfg = {
    baseElement: HTMLElement,
    suffix: null,
    ...customConfig,
  };

  describe(`FormRegistrationMixins${cfg.suffix ? ` (${cfg.suffix})` : ''}`, () => {
    let parentTag;
    let childTag;

    before(async () => {
      if (!cfg.parentTagString) {
        cfg.parentTagString = defineCE(class extends FormRegistrarMixin(cfg.baseElement) {});
      }
      if (!cfg.childTagString) {
        cfg.childTagString = defineCE(class extends FormRegisteringMixin(cfg.baseElement) {});
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
            <${childTag}></${childTag}>
          </${parentTag}>
        </${parentTag}>
      `);
      await el.registrationReady;
      expect(el.formElements.length).to.equal(1);
      expect(el.querySelector(cfg.parentTagString).formElements.length).to.equal(2);
    });

    it('forgets disconnected registrars', async () => {
      const el = await fixture(html`
        <${parentTag}>
          <${parentTag}>
            <${childTag}</${childTag}
          </${parentTag}>
        </${parentTag}>
      `);

      const secondRegistrar = await fixture(html`
        <${parentTag}>
          <${childTag}</${childTag}
        </${parentTag}>
      `);

      el.appendChild(secondRegistrar);
      expect(formRegistrarManager.__elements.length).to.equal(3);

      el.removeChild(secondRegistrar);
      expect(formRegistrarManager.__elements.length).to.equal(2);
    });

    it('works for components that have a delayed render', async () => {
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
      const el = await fixture(html`
        <${tagWrapper}>
          <${childTag}></${childTag}>
        </${tagWrapper}>
      `);
      await el.registrationReady;
      expect(el.formElements.length).to.equal(1);
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
