import { expect, fixture, html, aTimeout } from '@open-wc/testing';

export function runOverlayMixinSuite({ /* tagString, */ tag, suffix = '' }) {
  describe(`OverlayMixin${suffix}`, () => {
    let el;

    beforeEach(async () => {
      el = await fixture(html`
        <${tag}>
          <div slot="content">content of the overlay</div>
          <button slot="invoker">invoker button</button>
        </${tag}>
      `);
    });

    it('should not be opened by default', async () => {
      expect(el.opened).to.be.false;
      expect(el._overlayCtrl.isShown).to.be.false;
    });

    it('syncs opened to overlayController', async () => {
      el.opened = true;
      expect(el.opened).to.be.true;
      await aTimeout(); // overlayCtrl show/hide is async
      expect(el._overlayCtrl.isShown).to.be.true;

      el.opened = false;
      expect(el.opened).to.be.false;
      await aTimeout(0); // overlayCtrl show/hide is async
      expect(el._overlayCtrl.isShown).to.be.false;
    });

    it('syncs overlayController to opened', async () => {
      expect(el.opened).to.be.false;
      await el._overlayCtrl.show();
      expect(el.opened).to.be.true;

      await el._overlayCtrl.hide();
      expect(el.opened).to.be.false;
    });

    it('should respond to initially and dynamically setting the config', async () => {
      const itEl = await fixture(html`
          <${tag} .config=${{ trapsKeyboardFocus: false, viewportConfig: { placement: 'top' } }}>
            <div slot="content">content of the overlay</div>
            <button slot="invoker">invoker button</button>
          </${tag}>
        `);
      itEl.opened = true;
      await itEl.updateComplete;
      expect(itEl._overlayCtrl.trapsKeyboardFocus).to.be.false;

      itEl.config = { viewportConfig: { placement: 'left' } };
      expect(itEl._overlayCtrl.viewportConfig.placement).to.equal('left');
    });
  });
}
