/* eslint-disable lit-a11y/click-events-have-key-events */
import { LionButtonSubmit } from '@lion/ui/button.js';
import { aTimeout, defineCE, expect, fixture, html, unsafeStatic } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';

export function LionButtonSubmitSuite({ klass = LionButtonSubmit } = {}) {
  const tagStringButton = defineCE(class extends klass {});
  const tagButton = unsafeStatic(tagStringButton);

  describe('LionButtonSubmit', () => {
    it('has .type="submit" and type="submit" by default', async () => {
      const el = /** @type {LionButtonSubmit} */ (
        await fixture(html`<${tagButton}>foo</${tagButton}>`)
      );
      expect(el.type).to.equal('submit');
      expect(el.getAttribute('type')).to.be.equal('submit');
    });

    describe('Implicit form submission', () => {
      describe('Helper submit button', () => {
        it('creates a helper submit button when type is "submit"', async () => {
          let lionBtnEl;
          const elTypeSubmit = /** @type {HTMLFormElement} */ (
            await fixture(html`<form><${tagButton} type="submit">foo</${tagButton}></form>`)
          );
          lionBtnEl = /** @type {LionButtonSubmit} */ (elTypeSubmit.querySelector('[type=submit]'));
          // @ts-ignore [allow-protected] in test
          expect(lionBtnEl._nativeButtonNode instanceof HTMLButtonElement).to.be.true;
          // @ts-ignore [allow-protected] in test
          expect(lionBtnEl._nativeButtonNode.type).to.equal('submit');

          const elTypeReset = /** @type {LionButtonSubmit} */ (
            await fixture(html`<form><${tagButton} type="reset">foo</${tagButton}></form>`)
          );
          lionBtnEl = /** @type {LionButtonSubmit} */ (elTypeReset.querySelector('[type=reset]'));
          // @ts-ignore [allow-protected] in test
          expect(lionBtnEl._nativeButtonNode).to.be.null;

          const elTypeButton = /** @type {LionButtonSubmit} */ (
            await fixture(html`<form><${tagButton} type="button">foo</${tagButton}></form>`)
          );

          lionBtnEl = /** @type {LionButtonSubmit} */ (elTypeButton.querySelector('[type=button]'));
          // @ts-ignore [allow-protected] in test
          expect(lionBtnEl._nativeButtonNode).to.be.null;
        });

        it('only creates a helper submit button when LionButtonSubmit is inside a form', async () => {
          const elForm = /** @type {HTMLFormElement} */ (await fixture(html`<form></form>`));
          const el = /** @type {LionButtonSubmit} */ (
            await fixture(html`<${tagButton} type="submit">foo</${tagButton}>`)
          );
          // @ts-ignore [allow-protected] in test
          expect(el._nativeButtonNode).to.be.null;

          elForm.appendChild(el);
          await el.updateComplete;
          // @ts-ignore [allow-protected] in test
          expect(el._nativeButtonNode).to.be.not.null;

          elForm.removeChild(el);
          // @ts-ignore [allow-protected] in test
          expect(el._nativeButtonNode).to.be.null;
        });

        it('puts helper submit button at the bottom of a form', async () => {
          const elForm = /** @type {HTMLFormElement} */ (
            await fixture(
              html`<form><input /><${tagButton} type="submit">foo</${tagButton}><input /></form>`,
            )
          );
          const lionBtnEl = /** @type {LionButtonSubmit} */ (elForm.querySelector('[type=submit]'));
          expect(elForm.children.length).to.equal(4); // 3 + 1
          // @ts-ignore [allow-protected] in test
          expect(lionBtnEl._nativeButtonNode).to.be.not.null;
          // @ts-ignore [allow-protected] in test
          expect(elForm.children[3].firstChild).to.equal(lionBtnEl._nativeButtonNode);
        });

        it('creates max one helper submit button per form', async () => {
          const elForm = /** @type {HTMLFormElement} */ (
            await fixture(html`
            <form>
              <input />
              <${tagButton} type="submit">foo</${tagButton}>
              <${tagButton} type="submit">foo</${tagButton}>
              <input />
            </form>
          `)
          );
          const [lionBtnEl1, lionBtnEl2] = /** @type {LionButtonSubmit[]} */ (
            Array.from(elForm.querySelectorAll('[type=submit]'))
          );
          const { children } = elForm;
          expect(children.length).to.equal(5); // 4 + 1
          // @ts-ignore [allow-protected] in test
          expect(lionBtnEl1._nativeButtonNode).to.be.not.null;
          // @ts-ignore [allow-protected] in test
          expect(lionBtnEl2._nativeButtonNode).to.be.not.null;
          // @ts-ignore [allow-protected] in test
          expect(children[children.length - 1].firstChild).to.equal(lionBtnEl1._nativeButtonNode);
          // @ts-ignore [allow-protected] in test
          expect(children[children.length - 1].firstChild).to.equal(lionBtnEl2._nativeButtonNode);
        });

        it('helper submit button gets reconnected when external context changes (rerenders)', async () => {
          const elForm = /** @type {HTMLFormElement} */ (
            await fixture(html`<form><${tagButton} type="submit">foo</${tagButton}></form>`)
          );
          const helperBtnEl = /** @type {HTMLButtonElement} */ (
            elForm.querySelector('button[type=submit]')
          );
          helperBtnEl.remove();
          expect(elForm).to.not.include(helperBtnEl);
          await aTimeout(0);
          expect(elForm).to.include(helperBtnEl);
        });

        it('helper submit button gets removed when last LionbuttonSubmit gets disconnected from form', async () => {
          const elForm = /** @type {HTMLFormElement} */ (
            await fixture(
              html`<form><${tagButton} type="submit">foo</${tagButton}><${tagButton} type="submit">foo</${tagButton}></form>`,
            )
          );
          const [lionBtnEl1, lionBtnEl2] = /** @type {LionButtonSubmit[]} */ (
            Array.from(elForm.querySelectorAll('[type=submit]'))
          );
          const helperBtnEl = elForm.children[elForm.children.length - 1].firstChild;
          // @ts-ignore [allow-protected] in test
          expect(helperBtnEl).to.equal(lionBtnEl1._nativeButtonNode);
          // @ts-ignore [allow-protected] in test
          expect(helperBtnEl).to.equal(lionBtnEl2._nativeButtonNode);

          elForm.removeChild(lionBtnEl1);
          // @ts-ignore [allow-protected] in test
          expect(helperBtnEl).to.equal(lionBtnEl2._nativeButtonNode);

          elForm.removeChild(lionBtnEl2);
          // @ts-ignore [allow-protected] in test
          expect(helperBtnEl).to.not.equal(lionBtnEl2._nativeButtonNode);
          expect(Array.from(elForm.children)).to.not.include(helperBtnEl);
        });

        it('hides the helper submit button in the UI', async () => {
          const el = /** @type {LionButtonSubmit} */ (
            await fixture(html`<form><${tagButton}>foo</${tagButton}></form>`)
          );
          // @ts-ignore [allow-protected] in test
          const helperButtonEl = el.querySelector(tagStringButton)._nativeButtonNode;
          expect(helperButtonEl.getAttribute('tabindex')).to.equal('-1');
          expect(window.getComputedStyle(helperButtonEl).clip).to.equal('rect(0px, 0px, 0px, 0px)');
        });
      });

      it('works with implicit form submission on-enter inside an input', async () => {
        const formSubmitSpy = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
        const form = await fixture(html`
            <form @submit="${formSubmitSpy}">
              <input name="foo" />
              <input name="foo2" />
              <${tagButton} type="submit">foo</${tagButton}>
            </form>
          `);

        const input2 = /** @type {HTMLInputElement} */ (form.querySelector('input[name="foo2"]'));
        input2.focus();
        await sendKeys({
          press: 'Enter',
        });
        expect(formSubmitSpy).to.have.been.calledOnce;
      });
    });

    describe('Accessibility', () => {
      it('the helper button has aria-hidden set to true', async () => {
        const el = /** @type {LionButtonSubmit} */ (
          await fixture(html`<form><${tagButton}></${tagButton}></form>`)
        );
        // @ts-ignore [allow-protected] in test
        const helperButtonEl = el.querySelector(tagStringButton)._nativeButtonNode;
        expect(helperButtonEl.getAttribute('aria-hidden')).to.equal('true');
      });
    });
  });
}
