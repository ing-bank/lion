import { expect, fixture, html } from '@open-wc/testing';

import '../lion-dialog.js';

// Smoke tests dialog
describe('lion-dialog', () => {
  describe('Basic', () => {
    it('should not be shown by default', async () => {
      const el = await fixture(html`
        <lion-dialog>
          <div slot="content" class="dialog">Hey there</div>
          <lion-button slot="invoker">Popup button</lion-button>
        </lion-dialog>
      `);
      expect(el._overlayCtrl.isShown).to.be.false;
    });

    it('should show content on invoker click', async () => {
      const el = await fixture(html`
        <lion-dialog>
          <div slot="content" class="dialog">
            Hey there
          </div>
          <lion-button slot="invoker">Popup button</lion-button>
        </lion-dialog>
      `);
      const invoker = el.querySelector('[slot="invoker"]');
      invoker.click();

      expect(el._overlayCtrl.isShown).to.be.true;
    });

    it('should hide content on close event', async () => {
      const el = await fixture(html`
        <lion-dialog>
          <div slot="content" class="dialog">
            Hey there
            <button @click=${e => e.target.dispatchEvent(new Event('close', { bubbles: true }))}>
              x
            </button>
          </div>
          <lion-button slot="invoker">Popup button</lion-button>
        </lion-dialog>
      `);
      const invoker = el.querySelector('[slot="invoker"]');
      invoker.click();

      expect(el._overlayCtrl.isShown).to.be.true;

      const closeBtn = el._overlayCtrl.contentNode.querySelector('button');
      closeBtn.click();

      expect(el._overlayCtrl.isShown).to.be.false;
    });

    it('should respond to initially and dynamically setting the config', async () => {
      const el = await fixture(html`
        <lion-dialog .config=${{ trapsKeyboardFocus: false, viewportConfig: { placement: 'top' } }}>
          <div slot="content" class="dialog">Hey there</div>
          <lion-button slot="invoker">Popup button</lion-button>
        </lion-dialog>
      `);
      await el._overlayCtrl.show();
      expect(el._overlayCtrl.trapsKeyboardFocus).to.be.false;

      el.config = { viewportConfig: { placement: 'left' } };
      expect(el._overlayCtrl.viewportConfig.placement).to.equal('left');
      expect(
        el._overlayCtrl._contentNodeWrapper.classList.contains(
          'global-overlays__overlay-container--left',
        ),
      );
    });
  });
});
