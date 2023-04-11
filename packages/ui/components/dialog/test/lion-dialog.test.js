import { expect, fixture as _fixture, html, unsafeStatic } from '@open-wc/testing';
import { runOverlayMixinSuite } from '../../overlays/test-suites/OverlayMixin.suite.js';
import '@lion/ui/define/lion-dialog.js';

/**
 * @typedef {import('../src/LionDialog.js').LionDialog} LionDialog
 * @typedef {import('lit').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult) => Promise<LionDialog>} */ (_fixture);

/**
 * @param {HTMLElement} element
 * */
const isInViewport = element => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

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

  describe('focus handling', () => {
    it('should focus the element specified in the "elementToFocusAfterHide" config key', async () => {
      const outsideBtn = await fixture(
        html`<button type="button" id="outside-button">Focus</button>`,
      );
      const cfg = {
        trapsKeyboardFocus: false,
        elementToFocusAfterHide: outsideBtn,
      };
      const el = await fixture(html`
        <div>
          ${outsideBtn}
          <lion-dialog .config="${cfg}">
            <div slot="content" class="dialog">
              <button id="focusable-inside-button">Focusable el inside</button>
              Hey there
            </div>
            <button slot="invoker">Popup button</button>
          </lion-dialog>
        </div>
      `);

      const dialog = /** @type {LionDialog} */ (el.querySelector('lion-dialog'));
      const focusableInsideBtn = /** @type {HTMLButtonElement} */ (
        dialog.querySelector('#focusable-inside-button')
      );

      // @ts-expect-error [allow-protected-in-tests]
      dialog._overlayInvokerNode.click();
      focusableInsideBtn.focus();
      // @ts-expect-error [allow-protected-in-tests]
      await dialog._overlayCtrl._showComplete;
      dialog.close();

      // @ts-expect-error [allow-protected-in-tests]
      await dialog._overlayCtrl._hideComplete;

      expect(document.activeElement).to.equal(outsideBtn);
      expect(isInViewport(outsideBtn)).to.be.true;
    });

    it('should focus the element specified in the "elementToFocusAfterHide" when modal', async () => {
      const outsideBtn = await fixture(
        html`<button type="button" id="outside-button">Focus</button>`,
      );
      const cfg = {
        trapsKeyboardFocus: true, // modal
        elementToFocusAfterHide: outsideBtn,
      };
      const el = await fixture(html`
        <div>
          ${outsideBtn}
          <lion-dialog .config="${cfg}">
            <div slot="content" class="dialog">Hey there</div>
            <button slot="invoker">Popup button</button>
          </lion-dialog>
        </div>
      `);

      const dialog = /** @type {LionDialog} */ (el.querySelector('lion-dialog'));

      // @ts-expect-error [allow-protected-in-tests]
      dialog._overlayInvokerNode.click();
      // @ts-expect-error [allow-protected-in-tests]
      await dialog._overlayCtrl._showComplete;
      dialog.close();

      // @ts-expect-error [allow-protected-in-tests]
      await dialog._overlayCtrl._hideComplete;

      expect(document.activeElement).to.equal(outsideBtn);
      expect(isInViewport(outsideBtn)).to.be.true;
    });

    it('should not focus the element specified in the "elementToFocusAfterHide" when user deliberately puts focus on another element when the dialog is open', async () => {
      const outsideBtn1 = await fixture(
        html`<button type="button" id="outside-button1">Focus</button>`,
      );
      const outsideBtn2 = await fixture(
        html`<button type="button" id="outside-button2">Focus</button>`,
      );

      const cfg = {
        trapsKeyboardFocus: false, // modal
        elementToFocusAfterHide: outsideBtn1,
      };
      const el = await fixture(html`
        <div>
          ${outsideBtn1} ${outsideBtn2}
          <lion-dialog .config="${cfg}">
            <div slot="content" class="dialog">Hey there</div>
            <button slot="invoker">Popup button</button>
          </lion-dialog>
        </div>
      `);

      const dialog = /** @type {LionDialog} */ (el.querySelector('lion-dialog'));

      // @ts-expect-error [allow-protected-in-tests]
      dialog._overlayInvokerNode.click();
      // @ts-expect-error [allow-protected-in-tests]
      await dialog._overlayCtrl._showComplete;
      outsideBtn2.focus();
      dialog.close();

      // @ts-expect-error [allow-protected-in-tests]
      await dialog._overlayCtrl._hideComplete;

      expect(document.activeElement).to.equal(outsideBtn2);
      expect(isInViewport(outsideBtn2)).to.be.true;
    });
  });
});
