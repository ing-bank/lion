import { expect, fixture, html, nextFrame, aTimeout } from '@open-wc/testing';
import sinon from 'sinon';
import { overlays } from '../src/overlays.js';

function getGlobalOverlayNodes() {
  return Array.from(overlays.globalRootNode.children).filter(
    child => !child.classList.contains('global-overlays__backdrop'),
  );
}

export function runOverlayMixinSuite({ tagString, tag, suffix = '' }) {
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
      await nextFrame(); // overlayCtrl show/hide is async
      expect(el._overlayCtrl.isShown).to.be.true;

      el.opened = false;
      expect(el.opened).to.be.false;
      await nextFrame(); // overlayCtrl show/hide is async
      expect(el._overlayCtrl.isShown).to.be.false;
    });

    it('syncs OverlayController to opened', async () => {
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
      await el.updateComplete;
      expect(spy.callCount).to.equal(1);
      expect(el.opened).to.be.true;
      await el._overlayCtrl.hide();
      await el.updateComplete;
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
      // Wait until it's done opening (handling features is async)
      await nextFrame();
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
      el.querySelector('[slot="invoker"]').click();
      await nextFrame();
      expect(el.opened).to.be.false;

      // Also, the opened state should be synced back to that of the OverlayController
      el.opened = true;
      expect(el.opened).to.be.true;
      await nextFrame();
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

  describe(`OverlayMixin${suffix} nested`, () => {
    it.skip('supports nested overlays', async () => {
      const el = await fixture(html`
        <${tag}>
          <div slot="content" id="mainContent">
            open nested overlay:
            <${tag}>
              <div slot="content" id="nestedContent">
                Nested content
              </div>
              <button slot="invoker" id="nestedInvoker">nested invoker button</button>
            </${tag}>
          </div>
          <button slot="invoker" id="mainInvoker">invoker button</button>
        </${tag}>
      `);

      if (el._overlayCtrl.placementMode === 'global') {
        expect(getGlobalOverlayNodes().length).to.equal(2);
      }

      el.opened = true;
      await aTimeout();
      expect(el._overlayCtrl.contentNode).to.be.displayed;
      const nestedOverlayEl = el._overlayCtrl.contentNode.querySelector(tagString);
      nestedOverlayEl.opened = true;
      await aTimeout();
      expect(nestedOverlayEl._overlayCtrl.contentNode).to.be.displayed;
    });

    it('reconstructs the overlay when disconnected and reconnected to DOM (support for nested overlay nodes)', async () => {
      const nestedEl = await fixture(html`
        <${tag} id="nest">
          <div slot="content" id="nestedContent">content of the nested overlay</div>
          <button slot="invoker">invoker nested</button>
        </${tag}>
      `);

      const mainEl = await fixture(html`
        <${tag} id="main">
          <div slot="content" id="mainContent">
            open nested overlay:
            ${nestedEl}
          </div>
          <button slot="invoker">invoker button</button>
        </${tag}>
      `);

      if (mainEl._overlayCtrl.placementMode === 'global') {
        // Specifically checking the output in global root node, because the _contentOverlayNode still references
        // the node that was removed in the teardown but hasn't been garbage collected due to reference to it still existing..

        // Find the outlets that are not backdrop outlets
        const overlayContainerNodes = getGlobalOverlayNodes();
        expect(overlayContainerNodes.length).to.equal(2);
        const lastContentNodeInContainer = overlayContainerNodes[0];
        // Check that the last container is the nested one with the intended content
        expect(lastContentNodeInContainer.firstElementChild.innerText).to.equal(
          'content of the nested overlay',
        );
        expect(lastContentNodeInContainer.firstElementChild.slot).to.equal('content');
      } else {
        const contentNode = mainEl._overlayContentNode.querySelector('#nestedContent');
        expect(contentNode).to.not.be.null;
        expect(contentNode.innerText).to.equal('content of the nested overlay');
      }
    });
  });
}
