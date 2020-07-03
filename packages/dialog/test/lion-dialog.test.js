import { runOverlayMixinSuite } from '@lion/overlays/test-suites/OverlayMixin.suite.js';
import { expect, fixture, html, unsafeStatic } from '@open-wc/testing';
import '../lion-dialog.js';

describe('lion-dialog', () => {
  // For some reason, globalRootNode is not cleared properly on disconnectedCallback from previous overlay test fixtures...
  // Not sure why this "bug" happens...
  beforeEach(() => {
    const globalRootNode = document.querySelector('.global-overlays');
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
          <div slot="content" class="dialog">
            Hey there
          </div>
          <button slot="invoker">Popup button</button>
        </lion-dialog>
      `);
      const invoker = el.querySelector('[slot="invoker"]');
      invoker.click();

      expect(el.opened).to.be.true;
    });

    it('supports nested overlays', async () => {
      const el = await fixture(html`
        <lion-dialog>
          <div slot="content">
            open nested overlay:
            <lion-dialog>
              <div slot="content">
                Nested content
              </div>
              <button slot="invoker">nested invoker button</button>
            </lion-dialog>
          </div>
          <button slot="invoker">invoker button</button>
        </lion-dialog>
      `);

      el._overlayInvokerNode.click();
      expect(el.opened).to.be.true;

      const wrapperNode = Array.from(document.querySelector('.global-overlays').children)[1];
      const nestedDialog = wrapperNode.querySelector('lion-dialog');
      nestedDialog._overlayInvokerNode.click();
      expect(nestedDialog.opened).to.be.true;
    });
  });
});
