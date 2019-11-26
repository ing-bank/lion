import { expect, fixture, html } from '@open-wc/testing';

import '../lion-overlay.js';

describe('lion-overlay', () => {
  describe('Basic', () => {
    it('should not be shown by default', async () => {
      const el = await fixture(html`
        <lion-overlay>
          <div slot="content">Hey there</div>
          <lion-button slot="invoker">Invoker button</lion-button>
        </lion-overlay>
      `);
      expect(el._overlayCtrl.isShown).to.be.false;
    });

    it('should show content on invoker click', async () => {
      const el = await fixture(html`
        <lion-overlay>
          <div slot="content">
            Hey there
          </div>
          <lion-button slot="invoker">Invoker button</lion-button>
        </lion-overlay>
      `);
      const invoker = el.querySelector('[slot="invoker"]');
      invoker.click();
      await el.updateComplete;

      expect(el._overlayCtrl.isShown).to.be.true;
    });

    it('should hide content on close event', async () => {
      const el = await fixture(html`
        <lion-overlay>
          <div slot="content">
            Hey there
            <button @click=${e => e.target.dispatchEvent(new Event('close', { bubbles: true }))}>
              x
            </button>
          </div>
          <lion-button slot="invoker">Invoker button</lion-button>
        </lion-overlay>
      `);
      const invoker = el.querySelector('[slot="invoker"]');
      invoker.click();
      await el.updateComplete;

      expect(el._overlayCtrl.isShown).to.be.true;

      const closeBtn = el._overlayCtrl.contentNode.querySelector('button');
      closeBtn.click();
      await el.updateComplete;

      expect(el._overlayCtrl.isShown).to.be.false;
    });

    it('should respond to initially and dynamically setting the config', async () => {
      const el = await fixture(html`
        <lion-overlay
          .config=${{ trapsKeyboardFocus: false, viewportConfig: { placement: 'top' } }}
        >
          <div slot="content">Hey there</div>
          <lion-button slot="invoker">Invoker button</lion-button>
        </lion-overlay>
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
