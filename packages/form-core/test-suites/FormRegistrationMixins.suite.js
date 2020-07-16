import { LitElement } from '@lion/core';
import { defineCE, expect, fixture, html, unsafeStatic } from '@open-wc/testing';
import { FormRegisteringMixin } from '../src/registration/FormRegisteringMixin.js';
import { FormRegistrarMixin } from '../src/registration/FormRegistrarMixin.js';
import { FormRegistrarPortalMixin } from '../src/registration/FormRegistrarPortalMixin.js';

export const runRegistrationSuite = customConfig => {
  const cfg = {
    baseElement: HTMLElement,
    ...customConfig,
  };

  describe(`FormRegistrationMixins ${cfg.suffix}`, () => {
    let parentTag;
    let childTag;
    let portalTag;

    before(async () => {
      if (!cfg.parentTagString) {
        cfg.parentTagString = defineCE(class extends FormRegistrarMixin(cfg.baseElement) {});
      }
      if (!cfg.childTagString) {
        cfg.childTagString = defineCE(class extends FormRegisteringMixin(cfg.baseElement) {});
      }
      if (!cfg.portalTagString) {
        cfg.portalTagString = defineCE(class extends FormRegistrarPortalMixin(cfg.baseElement) {});
      }

      parentTag = unsafeStatic(cfg.parentTagString);
      childTag = unsafeStatic(cfg.childTagString);
      portalTag = unsafeStatic(cfg.portalTagString);
    });

    it('can register a formElement', async () => {
      const el = await fixture(html`
        <${parentTag}>
          <${childTag}></${childTag}>
        </${parentTag}>
      `);
      expect(el.formElements.length).to.equal(1);
    });

    it('can register a formElement with arbitrary dom tree in between registrar and registering', async () => {
      const el = await fixture(html`
        <${parentTag}>
          <div>
            <${childTag}></${childTag}>
          </div>
        </${parentTag}>
      `);
      expect(el.formElements.length).to.equal(1);
    });

    it('supports nested registration parents', async () => {
      const el = await fixture(html`
        <${parentTag}>
          <${parentTag} class="sub-group">
            <${childTag}></${childTag}>
            <${childTag}></${childTag}>
          </${parentTag}>
        </${parentTag}>
      `);
      expect(el.formElements.length).to.equal(1);

      const subGroup = el.querySelector('.sub-group');
      expect(subGroup.formElements.length).to.equal(2);
    });

    it('works for components that have a delayed render', async () => {
      const tagWrapperString = defineCE(
        class extends FormRegistrarMixin(LitElement) {
          async performUpdate() {
            await new Promise(resolve => setTimeout(() => resolve(), 10));
            await super.performUpdate();
          }

          render() {
            return html`<slot></slot>`;
          }
        },
      );
      const tagWrapper = unsafeStatic(tagWrapperString);
      const el = await fixture(html`
        <${tagWrapper}>
          <${childTag}></${childTag}>
        </${tagWrapper}>
      `);
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

    it('adds elements to formElements in the right order (DOM)', async () => {
      const el = await fixture(html`
        <${parentTag}>
          <${childTag}></${childTag}>
          <${childTag}></${childTag}>
          <${childTag}></${childTag}>
        </${parentTag}>
      `);
      const newField = await fixture(html`
        <${childTag}></${childTag}>
      `);
      newField.myProp = 'test';

      el.insertBefore(newField, el.children[1]);

      expect(el.formElements.length).to.equal(4);
      expect(el.children[1].myProp).to.equal('test');
      expect(el.formElements[1].myProp).to.equal('test');
    });

    describe('FormRegistrarPortalMixin', () => {
      it('forwards registrations to the .registrationTarget', async () => {
        const el = await fixture(html`<${parentTag}></${parentTag}>`);
        await fixture(html`
          <${portalTag} .registrationTarget=${el}>
            <${childTag}></${childTag}>
          </${portalTag}>
        `);

        expect(el.formElements.length).to.equal(1);
      });

      it('can dynamically add/remove elements', async () => {
        const el = await fixture(html`<${parentTag}></${parentTag}>`);
        const portal = await fixture(html`
          <${portalTag} .registrationTarget=${el}>
            <${childTag}></${childTag}>
          </${portalTag}>
        `);
        const newField = await fixture(html`
          <${childTag}></${childTag}>
        `);

        expect(el.formElements.length).to.equal(1);

        portal.appendChild(newField);
        expect(el.formElements.length).to.equal(2);

        portal.removeChild(newField);
        expect(el.formElements.length).to.equal(1);
      });

      it('adds elements to formElements in the right order', async () => {
        const el = await fixture(html`
          <${parentTag}>
            <${childTag}></${childTag}>
            <${childTag}></${childTag}>
            <${childTag}></${childTag}>
          </${parentTag}>
        `);

        expect(el.formElements.length).to.equal(3);

        // In the middle
        const secondChild = el.firstElementChild.nextElementSibling;
        const newField = await fixture(html`
          <${childTag}></${childTag}>
        `);
        secondChild.insertAdjacentElement('beforebegin', newField);

        expect(el.formElements.length).to.equal(4);
        expect(el.formElements[1]).dom.to.equal(newField);

        // Prepending
        const anotherField = await fixture(html`
          <${childTag}></${childTag}>
        `);
        el.prepend(anotherField);
        expect(el.formElements.length).to.equal(5);
        expect(el.formElements[0]).dom.to.equal(anotherField);

        // Appending
        const yetAnotherField = await fixture(html`
          <${childTag}></${childTag}>
        `);
        el.appendChild(yetAnotherField);
        expect(el.formElements.length).to.equal(6);
        expect(el.formElements[5]).dom.to.equal(anotherField);
      });

      it('keeps working if moving the portal itself', async () => {
        const el = await fixture(html`<${parentTag}></${parentTag}>`);
        const portal = await fixture(html`
          <${portalTag} .registrationTarget=${el}>
            <${childTag}></${childTag}>
          </${portalTag}>
        `);
        const otherPlace = await fixture(html`<div></div>`);
        otherPlace.appendChild(portal);
        const newField = await fixture(html`
          <${childTag}></${childTag}>
        `);

        expect(el.formElements.length).to.equal(1);

        portal.appendChild(newField);
        expect(el.formElements.length).to.equal(2);

        portal.removeChild(newField);
        expect(el.formElements.length).to.equal(1);
      });

      it('works for portals that have a delayed render', async () => {
        const delayedPortalString = defineCE(
          class extends FormRegistrarPortalMixin(LitElement) {
            async performUpdate() {
              await new Promise(resolve => setTimeout(() => resolve(), 10));
              await super.performUpdate();
            }

            render() {
              return html`<slot></slot>`;
            }
          },
        );
        const delayedPortalTag = unsafeStatic(delayedPortalString);

        const el = await fixture(html`<${parentTag}></${parentTag}>`);
        await fixture(html`
          <${delayedPortalTag} .registrationTarget=${el}>
            <${childTag}></${childTag}>
          </${delayedPortalTag}>
        `);

        expect(el.formElements.length).to.equal(1);
      });
    });
  });
};
