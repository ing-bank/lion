/* eslint-disable lit-a11y/no-autofocus */
import { expect, fixture as _fixture, html, unsafeStatic, aTimeout } from '@open-wc/testing';
import { runOverlayMixinSuite } from '../../overlays/test-suites/OverlayMixin.suite.js';
import { isActiveElement } from '../../core/test-helpers/isActiveElement.js';
import '../test-helpers/test-router.js';
import '@lion/ui/define/lion-dialog.js';

/**
 * @typedef {import('../src/LionDialog.js').LionDialog} LionDialog
 * @typedef {import('lit').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult) => Promise<LionDialog>} */ (_fixture);

describe('lion-dialog', () => {
  // For some reason, globalRootNode is not cleared properly on disconnectedCallback from previous overlay test fixtures...
  // Not sure why this "bug" happens...
  beforeEach(() => {
    const globalRootNode = document.querySelector('.overlays');
    if (globalRootNode) {
      globalRootNode.innerHTML = '';
    }
  });

  describe('Integration tests', () => {
    const tagString = 'lion-dialog';
    const tag = unsafeStatic(tagString);

    runOverlayMixinSuite({
      tagString,
      tag,
      suffix: ' for lion-dialog',
    });
  });

  describe('Basic', () => {
    it('should show content on invoker click', async () => {
      const el = await fixture(html`
        <lion-dialog>
          <div slot="content" class="dialog">Hey there</div>
          <button slot="invoker">Popup button</button>
        </lion-dialog>
      `);
      const invoker = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));
      invoker.click();
      // @ts-expect-error [allow-protected-in-tests]
      await el._overlayCtrl._showComplete;
      expect(el.opened).to.be.true;
    });

    it('supports nested overlays', async () => {
      const el = await fixture(html`
        <lion-dialog>
          <div slot="content">
            open nested overlay:
            <lion-dialog>
              <div slot="content">Nested content</div>
              <button slot="invoker">nested invoker button</button>
            </lion-dialog>
          </div>
          <button slot="invoker">invoker button</button>
        </lion-dialog>
      `);

      // @ts-expect-error [allow-protected-in-tests]
      el._overlayInvokerNode.click();
      // @ts-expect-error [allow-protected-in-tests]
      await el._overlayCtrl._showComplete;
      expect(el.opened).to.be.true;

      const nestedDialogEl = /** @type {LionDialog} */ (el.querySelector('lion-dialog'));
      // @ts-expect-error you're not allowed to call protected _overlayInvokerNode in public context, but for testing it's okay
      nestedDialogEl?._overlayInvokerNode.click();
      // @ts-expect-error [allow-protected-in-tests]
      await nestedDialogEl._overlayCtrl._showComplete;
      expect(nestedDialogEl.opened).to.be.true;
    });
  });

  describe('focus', () => {
    it('sets focus on contentSlot by default', async () => {
      const el = await fixture(html`
        <lion-dialog>
          <button slot="invoker">invoker button</button>
          <div slot="content">
            <label for="myInput">Label</label>
            <input id="myInput" />
          </div>
        </lion-dialog>
      `);
      // @ts-expect-error [allow-protected-in-tests]
      const invokerNode = el._overlayInvokerNode;
      invokerNode.focus();
      invokerNode.click();
      const contentNode = /** @type {Element} */ (el.querySelector('[slot="content"]'));
      expect(isActiveElement(contentNode)).to.be.true;
    });

    it('sets focus on autofocused element', async () => {
      const el = await fixture(html`
        <lion-dialog>
          <button slot="invoker">invoker button</button>
          <div slot="content">
            <label for="myInput">Label</label>
            <input id="myInput" autofocus />
          </div>
        </lion-dialog>
      `);
      // @ts-expect-error [allow-protected-in-tests]
      const invokerNode = el._overlayInvokerNode;
      invokerNode.focus();
      invokerNode.click();
      const input = /** @type {Element} */ (el.querySelector('input'));
      expect(isActiveElement(input)).to.be.true;
    });

    it('with trapsKeyboardFocus set to false the focus stays on the invoker', async () => {
      const el = /** @type {LionDialog} */ await fixture(html`
        <lion-dialog .config=${{ trapsKeyboardFocus: false }}>
          <button slot="invoker">invoker button</button>
          <div slot="content">
            <label for="myInput">Label</label>
            <input id="myInput" autofocus />
          </div>
        </lion-dialog>
      `);
      // @ts-expect-error [allow-protected-in-tests]
      const invokerNode = el._overlayInvokerNode;
      invokerNode.focus();
      invokerNode.click();
      expect(isActiveElement(invokerNode)).to.be.true;
    });

    it('opened-changed event should send detail object with opened state', async () => {
      const el = /** @type {LionDialog} */ await fixture(html`
        <lion-dialog .config=${{ trapsKeyboardFocus: false }}>
          <button slot="invoker">invoker button</button>
          <div slot="content">
            <label for="myInput">Label</label>
            <input id="myInput" autofocus />
          </div>
        </lion-dialog>
      `);

      el.setAttribute('opened', '');
      expect(el.opened).to.be.true;

      el.addEventListener('opened-changed', e => {
        // @ts-expect-error [allow-detail-since-custom-event]
        expect(e.detail.opened).to.be.false;
      });
      el.removeAttribute('opened');
    });

    it("opened-changed event's target should point to lion-dialog", async () => {
      const el = /** @type {LionDialog} */ await fixture(html`
        <lion-dialog .config=${{ trapsKeyboardFocus: false }}>
          <button slot="invoker">invoker button</button>
          <div slot="content">
            <label for="myInput">Label</label>
            <input id="myInput" autofocus />
          </div>
        </lion-dialog>
      `);

      el.addEventListener('opened-changed', e => {
        expect(e.target).to.equal(el);
      });
      el.setAttribute('opened', '');
    });
  });

  describe('Accessibility', () => {
    it('does not add [aria-expanded] to invoker button', async () => {
      const el = await fixture(
        html` <lion-dialog>
          <div slot="content" class="dialog">Hey there</div>
          <button slot="invoker">Popup button</button>
        </lion-dialog>`,
      );
      const invokerButton = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));

      expect(invokerButton.getAttribute('aria-expanded')).to.equal(null);
      await invokerButton.click();
      await aTimeout(0);
      expect(invokerButton.getAttribute('aria-expanded')).to.equal(null);
      await invokerButton.click();
      await aTimeout(0);
      expect(invokerButton.getAttribute('aria-expanded')).to.equal(null);
    });
  });

  describe('Edge cases', () => {
    it('does not lose click event handler when was detached and reattached', async () => {
      const el = await fixture(html`
        <test-router
          .routingMap="${{
            a: html`
              <lion-dialog>
                <div slot="content" class="dialog">Hey there</div>
                <button slot="invoker">Popup button</button>
              </lion-dialog>
            `,
            b: html` <div>B</div> `,
          }}"
          path="a"
        ></test-router>
      `);

      const getDialog = () =>
        /** @type {LionDialog} */ (el.shadowRoot?.querySelector('lion-dialog'));
      const getInvoker = () =>
        /** @type {HTMLElement} */ (getDialog().querySelector('[slot="invoker"]'));

      getInvoker().click();
      const dialog = getDialog();
      // @ts-expect-error [allow-protected-in-tests]
      await dialog._overlayCtrl._showComplete;
      expect(dialog.opened).to.be.true;

      dialog.close();
      // @ts-expect-error [allow-protected-in-tests]
      await dialog._overlayCtrl._hideComplete;
      expect(dialog.opened).to.be.false;

      const buttonA = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#path-a'));
      const buttonB = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#path-b'));

      buttonB.click();
      await el.updateComplete;
      buttonA.click();
      await el.updateComplete;
      await el.updateComplete;

      getInvoker().click();

      const dialogAfterRouteChange = getDialog();
      // @ts-expect-error [allow-protected-in-tests]
      expect(dialogAfterRouteChange._overlayCtrl).not.to.be.undefined;
      // @ts-expect-error [allow-protected-in-tests]
      await dialogAfterRouteChange._overlayCtrl._showComplete;
      expect(dialogAfterRouteChange.opened).to.be.true;
    });
  });
});
