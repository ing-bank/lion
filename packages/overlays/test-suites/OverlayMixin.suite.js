import { expect, fixture, html, aTimeout } from '@open-wc/testing';
import sinon from 'sinon';

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

    it('fires "opened-changed" event on hide', async () => {
      const spy = sinon.spy();
      el = await fixture(html`
        <${tag} @opened-changed="${spy}">
          <div slot="content">content of the overlay</div>
          <button slot="invoker">invoker button</button>
        </${tag}>
      `);
      expect(spy).not.to.have.been.called;
      await el._overlayCtrl.show();
      expect(spy.callCount).to.equal(1);
      expect(el.opened).to.be.true;
      await el._overlayCtrl.hide();
      expect(spy.callCount).to.equal(2);
      expect(el.opened).to.be.false;
    });

    it('fires "before-closed" event on hide', async () => {
      const beforeSpy = sinon.spy();
      el = await fixture(html`
        <${tag} @before-closed="${beforeSpy}" .opened="${true}">
          <div slot="content">content of the overlay</div>
          <button slot="invoker">invoker button</button>
        </${tag}>
      `);
      expect(beforeSpy).not.to.have.been.called;
      await el._overlayCtrl.hide();
      expect(beforeSpy).to.have.been.called;
      expect(el.opened).to.be.false;
    });

    it('fires before-opened" event on show', async () => {
      const beforeSpy = sinon.spy();
      el = await fixture(html`
        <${tag} @before-opened="${beforeSpy}">
          <div slot="content">content of the overlay</div>
          <button slot="invoker">invoker button</button>
        </${tag}>
      `);
      expect(beforeSpy).not.to.have.been.called;
      await el._overlayCtrl.show();
      expect(beforeSpy).to.have.been.called;
      expect(el.opened).to.be.true;
    });

    it('allows to call `preventDefault()` on "before-opened"/"before-closed" events', async () => {
      function preventer(ev) {
        ev.preventDefault();
      }
      el = await fixture(html`
        <${tag} @before-opened="${preventer}" @before-closed="${preventer}">
          <div slot="content">content of the overlay</div>
          <button slot="invoker">invoker button</button>
        </${tag}>
      `);
      await el._overlayCtrl.show();
      expect(el.opened).to.be.false;
    });

    it('hides content on "close-overlay" event within the content ', async () => {
      function sendCloseEvent(e) {
        e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }));
      }
      const closeBtn = await fixture(html`
        <button @click=${sendCloseEvent}>
          close
        </button>
      `);

      el = await fixture(html`
        <${tag} opened>
          <div slot="content">
            content of the overlay
            ${closeBtn}
          </div>
          <button slot="invoker">invoker button</button>
        </${tag}>
      `);
      closeBtn.click();
      expect(el.opened).to.be.false;
    });
  });
}
