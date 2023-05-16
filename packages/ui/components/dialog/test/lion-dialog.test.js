/* eslint-disable lit-a11y/no-autofocus */
import { expect, fixture as _fixture, html, unsafeStatic } from '@open-wc/testing';
import { runOverlayMixinSuite } from '../../overlays/test-suites/OverlayMixin.suite.js';
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
      const contentNode = el.querySelector('[slot="content"]');
      expect(document.activeElement).to.equal(contentNode);
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
      const input = el.querySelector('input');
      expect(document.activeElement).to.equal(input);
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
      expect(document.activeElement).to.equal(invokerNode);
    });
  });
});
