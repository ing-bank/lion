/* eslint-disable lit-a11y/click-events-have-key-events */
import { LionButtonReset } from '@lion/components/button.js';
import { aTimeout, defineCE, expect, fixture, html, unsafeStatic } from '@open-wc/testing';
import sinon from 'sinon';

export function LionButtonResetSuite({ klass = LionButtonReset } = {}) {
  const tagStringButtonReset = defineCE(class extends klass {});
  const tagButtonReset = unsafeStatic(tagStringButtonReset);

  describe('LionButtonReset', () => {
    it('has .type="reset" and type="reset" by default', async () => {
      const el = /** @type {LionButtonReset} */ (
        await fixture(html`<${tagButtonReset}>foo</${tagButtonReset}>`)
      );
      expect(el.type).to.equal('reset');
      expect(el.getAttribute('type')).to.be.equal('reset');
    });

    /**
     * Notice functionality below is not purely for type="reset", also for type="submit".
     * For mainainability purposes the submit functionality is part of LionButtonReset.
     * (it needs the same logic)
     * LionButtonReset could therefore actually be considered as 'LionButtonForm' (without the
     * implicit form submission logic), but LionButtonReset is an easier to grasp name for
     * Application Developers: for reset buttons, always use LionButtonReset, for submit
     * buttons always use LionButton.
     * For buttons that should support all three types (like native <button>); use LionButton.
     */
    describe('Form integration', () => {
      describe('With submit event', () => {
        it('behaves like native `button` when clicked', async () => {
          const formSubmitSpy = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
          const form = await fixture(html`
            <form @submit="${formSubmitSpy}">
              <${tagButtonReset} type="submit">foo</${tagButtonReset}>
            </form>
          `);
          const button /** @type {LionButtonReset} */ = /** @type {LionButtonReset} */ (
            form.querySelector(tagStringButtonReset)
          );
          button.click();
          expect(formSubmitSpy).to.have.been.calledOnce;
        });

        it('behaves like native `button` when interacted with keyboard space', async () => {
          const formSubmitSpy = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
          const form = await fixture(html`
            <form @submit="${formSubmitSpy}">
              <${tagButtonReset} type="submit">foo</${tagButtonReset}>
            </form>
          `);
          const button /** @type {LionButtonReset} */ = /** @type {LionButtonReset} */ (
            form.querySelector(tagStringButtonReset)
          );
          button.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
          await aTimeout(0);
          await aTimeout(0);
          expect(formSubmitSpy).to.have.been.calledOnce;
        });

        it('behaves like native `button` when interacted with keyboard enter', async () => {
          const formSubmitSpy = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
          const form = await fixture(html`
            <form @submit="${formSubmitSpy}">
              <${tagButtonReset} type="submit">foo</${tagButtonReset}>
            </form>
          `);

          const button = /** @type {LionButtonReset} */ (form.querySelector(tagStringButtonReset));
          button.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
          await aTimeout(0);
          await aTimeout(0);

          expect(formSubmitSpy).to.have.been.calledOnce;
        });

        it('supports resetting form inputs in a native form', async () => {
          const form = await fixture(html`
            <form>
              <input name="firstName" />
              <input name="lastName" />
              <${tagButtonReset} type="reset">reset</${tagButtonReset}>
            </form>
          `);
          const btn /** @type {LionButtonReset} */ = /** @type {LionButtonReset} */ (
            form.querySelector(tagStringButtonReset)
          );
          const firstName = /** @type {HTMLInputElement} */ (
            form.querySelector('input[name=firstName]')
          );
          const lastName = /** @type {HTMLInputElement} */ (
            form.querySelector('input[name=lastName]')
          );
          firstName.value = 'Foo';
          lastName.value = 'Bar';

          expect(firstName.value).to.equal('Foo');
          expect(lastName.value).to.equal('Bar');

          btn.click();

          expect(firstName.value).to.be.empty;
          expect(lastName.value).to.be.empty;
        });
      });
    });

    it('is fired once outside and inside the form', async () => {
      const outsideSpy = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
      const insideSpy = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
      const formSpyEarly = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
      const formSpyLater = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));

      const el = /** @type {HTMLDivElement} */ (
        await fixture(
          html`
            <div @click="${outsideSpy}">
              <form @click="${formSpyEarly}">
                <div @click="${insideSpy}">
                  <${tagButtonReset}>foo</${tagButtonReset}>
                </div>
              </form>
            </div>
          `,
        )
      );
      const lionButton = /** @type {LionButtonReset} */ (el.querySelector(tagStringButtonReset));
      const form = /** @type {HTMLFormElement} */ (el.querySelector('form'));
      form.addEventListener('click', formSpyLater);

      lionButton.click();
      // trying to wait for other possible redispatched events
      await aTimeout(0);
      await aTimeout(0);

      expect(insideSpy).to.have.been.calledOnce;
      expect(outsideSpy).to.have.been.calledOnce;
      // A small sacrifice for event listeners registered early: we get the native button evt.
      expect(formSpyEarly).to.have.been.calledTwice;
      expect(formSpyLater).to.have.been.calledOnce;
    });

    it('works when connected to different form', async () => {
      const form1El = /** @type {HTMLFormElement} */ (
        await fixture(
          html`
            <form>
              <${tagButtonReset}>foo</${tagButtonReset}>
            </form>
          `,
        )
      );
      const lionButton = /** @type {LionButtonReset} */ (
        form1El.querySelector(tagStringButtonReset)
      );

      expect(lionButton._form).to.equal(form1El);

      // Now we add the lionButton to a different form.
      // We disconnect and connect and check if everything still works as expected
      const outsideSpy = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
      const insideSpy = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
      const formSpyEarly = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
      const formSpyLater = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));

      const form2El = /** @type {HTMLFormElement} */ (
        await fixture(
          html`
            <div @click="${outsideSpy}">
              <form @click="${formSpyEarly}">
                <div @click="${insideSpy}">${lionButton}</div>
              </form>
            </div>
          `,
        )
      );
      const form2Node = /** @type {HTMLFormElement} */ (form2El.querySelector('form'));

      expect(lionButton._form).to.equal(form2Node);

      form2Node.addEventListener('click', formSpyLater);
      lionButton.click();
      // trying to wait for other possible redispatched events
      await aTimeout(0);
      await aTimeout(0);

      expect(insideSpy).to.have.been.calledOnce;
      expect(outsideSpy).to.have.been.calledOnce;
      // A small sacrifice for event listeners registered early: we get the native button evt.
      expect(formSpyEarly).to.have.been.calledTwice;
      expect(formSpyLater).to.have.been.calledOnce;
    });
  });
}
