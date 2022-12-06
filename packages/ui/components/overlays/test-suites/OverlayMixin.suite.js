import { expect, fixture, html, nextFrame, aTimeout } from '@open-wc/testing';

import sinon from 'sinon';
import { overlays as overlaysManager, OverlayController } from '@lion/ui/overlays.js';

import '@lion/ui/define/lion-dialog.js';
import { _browserDetection } from '../src/OverlaysManager.js';

/**
 * @typedef {import('../types/OverlayConfig.js').OverlayConfig} OverlayConfig
 * @typedef {import('../types/OverlayMixinTypes.js').DefineOverlayConfig} DefineOverlayConfig
 * @typedef {import('../types/OverlayMixinTypes.js').OverlayHost} OverlayHost
 * @typedef {import('../types/OverlayMixinTypes.js').OverlayMixin} OverlayMixin
 * @typedef {import('lit').LitElement} LitElement
 * @typedef {LitElement & OverlayHost & {_overlayCtrl:OverlayController}} OverlayEl
 */

function getGlobalOverlayCtrls() {
  return overlaysManager.list;
}

function resetOverlaysManager() {
  overlaysManager.list.forEach(overlayCtrl => overlaysManager.remove(overlayCtrl));
}

/**
 * @param {{tagString:string, tag: object, suffix?:string}} config
 */
export function runOverlayMixinSuite({ tagString, tag, suffix = '' }) {
  describe(`OverlayMixin${suffix}`, () => {
    it('should not be opened by default', async () => {
      const el = /** @type {OverlayEl} */ (
        await fixture(html`
        <${tag}>
          <div slot="content">content of the overlay</div>
          <button slot="invoker">invoker button</button>
        </${tag}>
      `)
      );
      expect(el.opened).to.be.false;
      expect(el._overlayCtrl.isShown).to.be.false;
    });

    it('syncs opened to overlayController', async () => {
      const el = /** @type {OverlayEl} */ (
        await fixture(html`
        <${tag}>
          <div slot="content">content of the overlay</div>
          <button slot="invoker">invoker button</button>
        </${tag}>
      `)
      );
      el.opened = true;
      await el.updateComplete;
      await el._overlayCtrl._showComplete;
      expect(el.opened).to.be.true;
      expect(el._overlayCtrl.isShown).to.be.true;

      el.opened = false;
      await el.updateComplete;
      await el._overlayCtrl._hideComplete;
      expect(el.opened).to.be.false;
      expect(el._overlayCtrl.isShown).to.be.false;
    });

    it('syncs OverlayController to opened', async () => {
      const el = /** @type {OverlayEl} */ (
        await fixture(html`
        <${tag}>
          <div slot="content">content of the overlay</div>
          <button slot="invoker">invoker button</button>
        </${tag}>
      `)
      );
      expect(el.opened).to.be.false;
      await el._overlayCtrl.show();
      expect(el.opened).to.be.true;

      await el._overlayCtrl.hide();
      expect(el.opened).to.be.false;
    });

    // TODO: put this tests in OverlayController.test.js instead?
    it('does not change the body size when opened', async () => {
      const parentNode = document.createElement('div');
      parentNode.setAttribute('style', 'height: 10000px; width: 10000px;');
      const elWithBigParent = /** @type {OverlayEl} */ (
        await fixture(
          html`
        <${tag}>
          <div slot="content">content of the overlay</div>
          <button slot="invoker">invoker button</button>
        </${tag}>
      `,
          { parentNode },
        )
      );

      // For now, we skip this test for MacSafari, since the body.global-overlays-scroll-lock-ios-fix
      // class results in a scrollbar when preventsScroll is true.
      // However, fully functioning interacive elements (input fields) in the dialog are more important
      if (_browserDetection.isMacSafari && elWithBigParent._overlayCtrl.preventsScroll) {
        return;
      }

      const elWithBigParentOffsetParent = /** @type {HTMLElement} */ (
        elWithBigParent?.offsetParent
      );

      const { offsetWidth, offsetHeight } = elWithBigParentOffsetParent;

      await elWithBigParent._overlayCtrl.show();

      expect(elWithBigParent.opened).to.be.true;
      expect(elWithBigParentOffsetParent.offsetWidth).to.equal(offsetWidth);
      expect(elWithBigParentOffsetParent.offsetHeight).to.equal(offsetHeight);
      await elWithBigParent._overlayCtrl.hide();
      expect(elWithBigParentOffsetParent.offsetWidth).to.equal(offsetWidth);
      expect(elWithBigParentOffsetParent.offsetHeight).to.equal(offsetHeight);
    });

    it('should respond to initially and dynamically setting the config', async () => {
      const itEl = /** @type {OverlayEl} */ (
        await fixture(html`
          <${tag} .config=${{ trapsKeyboardFocus: false, viewportConfig: { placement: 'top' } }}>
            <div slot="content">content of the overlay</div>
            <button slot="invoker">invoker button</button>
          </${tag}>
        `)
      );
      itEl.opened = true;
      await itEl.updateComplete;
      expect(itEl._overlayCtrl.trapsKeyboardFocus).to.be.false;

      await nextFrame();
      itEl.config = { viewportConfig: { placement: 'left' } };
      expect(itEl._overlayCtrl.viewportConfig.placement).to.equal('left');
    });

    it('fires "opened-changed" event on hide', async () => {
      const spy = sinon.spy();
      const el = /** @type {OverlayEl} */ (
        await fixture(html`
        <${tag} @opened-changed="${spy}">
          <div slot="content">content of the overlay</div>
          <button slot="invoker">invoker button</button>
        </${tag}>
      `)
      );
      expect(spy).not.to.have.been.called;
      await el._overlayCtrl.show();
      await el.updateComplete;
      expect(spy.callCount).to.equal(1);
      expect(el.opened).to.be.true;
      el.opened = true;
      await el.updateComplete;
      expect(spy.callCount).to.equal(1);
      await el._overlayCtrl.hide();
      await el.updateComplete;
      expect(spy.callCount).to.equal(2);
      expect(el.opened).to.be.false;
    });

    it('fires "before-closed" event on hide', async () => {
      const beforeSpy = sinon.spy();
      const el = /** @type {OverlayEl} */ (
        await fixture(html`
        <${tag} @before-closed="${beforeSpy}" opened>
          <div slot="content">content of the overlay</div>
          <button slot="invoker">invoker button</button>
        </${tag}>
      `)
      );
      // Wait until it's done opening (handling features is async)
      await nextFrame();
      expect(beforeSpy).not.to.have.been.called;
      await el._overlayCtrl.hide();
      expect(beforeSpy).to.have.been.called;
      expect(el.opened).to.be.false;
    });

    it('fires before-opened" event on show', async () => {
      const beforeSpy = sinon.spy();
      const el = /** @type {OverlayEl} */ (
        await fixture(html`
        <${tag} @before-opened="${beforeSpy}">
          <div slot="content">content of the overlay</div>
          <button slot="invoker">invoker button</button>
        </${tag}>
      `)
      );
      expect(beforeSpy).not.to.have.been.called;
      await el._overlayCtrl.show();
      expect(beforeSpy).to.have.been.called;
      expect(el.opened).to.be.true;
    });

    it('allows to call "preventDefault()" on "before-opened"/"before-closed" events', async () => {
      function preventer(/** @type Event */ ev) {
        ev.preventDefault();
      }
      const el = /** @type {OverlayEl} */ (
        await fixture(html`
        <${tag} @before-opened="${preventer}" @before-closed="${preventer}">
          <div slot="content">content of the overlay</div>
          <button slot="invoker">invoker button</button>
        </${tag}>
      `)
      );
      /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]')).click();
      await nextFrame();
      expect(el.opened).to.be.false;

      // Also, the opened state should be synced back to that of the OverlayController
      el.opened = true;
      expect(el.opened).to.be.true;
      await nextFrame();
      expect(el.opened).to.be.false;
    });

    it('hides content on "close-overlay" event within the content ', async () => {
      function sendCloseEvent(/** @type {Event} */ e) {
        e.target?.dispatchEvent(new Event('close-overlay', { bubbles: true }));
      }

      const el = /** @type {OverlayEl} */ (
        await fixture(html`
        <${tag} opened>
          <div slot="content">
            content of the overlay
            <button @click=${sendCloseEvent}>close</button>
          </div>
          <button slot="invoker">invoker button</button>
        </${tag}>
      `)
      );
      // @ts-ignore
      el.querySelector('[slot=content] button').click();
      await el._overlayCtrl._hideComplete;
      expect(el.opened).to.be.false;
    });

    // See https://github.com/ing-bank/lion/discussions/1095
    it('exposes "open()", "close()" and "toggle()" methods', async () => {
      const el = /** @type {OverlayEl} */ (
        await fixture(html`
        <${tag}>
          <div slot="content">content</div>
          <button slot="invoker">invoker button</button>
        </${tag}>
      `)
      );
      expect(el.opened).to.be.false;
      el.open();
      await nextFrame();
      expect(el.opened).to.be.true;

      el.close();
      await nextFrame();
      expect(el.opened).to.be.false;

      el.toggle();
      await nextFrame();
      expect(el.opened).to.be.true;

      el.toggle();
      await nextFrame();
      expect(el.opened).to.be.false;
    });

    it('exposes "repositionOverlay()" method', async () => {
      const el = /** @type {OverlayEl} */ (
        await fixture(html`
        <${tag} opened .config="${{ placementMode: 'local' }}">
          <div slot="content">content</div>
          <button slot="invoker">invoker button</button>
        </${tag}>
      `)
      );
      await OverlayController.popperModule;
      sinon.spy(el._overlayCtrl._popper, 'update');
      el.repositionOverlay();
      expect(el._overlayCtrl._popper.update).to.have.been.been.calledOnce;

      if (!el._overlayCtrl.isTooltip) {
        el.config = { ...el.config, placementMode: 'global' };
        el.repositionOverlay();
        expect(el._overlayCtrl._popper.update).to.have.been.been.calledOnce;
      }
    });

    /** See: https://github.com/ing-bank/lion/issues/1075 */
    it('stays open after config update', async () => {
      const el = /** @type {OverlayEl} */ (
        await fixture(html`
        <${tag}>
          <div slot="content">content</div>
          <button slot="invoker">invoker button</button>
        </${tag}>
      `)
      );
      el.open();
      await el._overlayCtrl._showComplete;

      el.config = { ...el.config, hidesOnOutsideClick: !el.config.hidesOnOutsideClick };
      await nextFrame();
      expect(el.opened).to.be.true;
      expect(getComputedStyle(el._overlayCtrl.contentWrapperNode).display).not.to.equal('none');
    });

    /** Prevent unnecessary reset side effects, such as show animation. See: https://github.com/ing-bank/lion/issues/1075 */
    it('does not call updateConfig on equivalent config change', async () => {
      const el = /** @type {OverlayEl} */ (
        await fixture(html`
        <${tag}>
          <div slot="content">content</div>
          <button slot="invoker">invoker button</button>
        </${tag}>
      `)
      );
      el.open();
      await nextFrame();

      const stub = sinon.stub(el._overlayCtrl, 'updateConfig');
      stub.callsFake(() => {
        throw new Error('Unexpected config update');
      });

      expect(() => {
        el.config = { ...el.config };
      }).to.not.throw;
      stub.restore();
    });
  });

  describe(`OverlayMixin${suffix} nested`, () => {
    // For some reason, globalRootNode is not cleared properly on disconnectedCallback from previous overlay test fixtures...
    // Not sure why this "bug" happens...
    beforeEach(() => {
      resetOverlaysManager();
    });

    it('supports nested overlays', async () => {
      const el = /** @type {OverlayEl} */ (
        await fixture(html`
        <${tag} id="main-dialog">
          <div slot="content" id="mainContent">
            open nested overlay:
            <${tag} id="sub-dialog">
              <div slot="content" id="nestedContent">
                Nested content
              </div>
              <button slot="invoker" id="nestedInvoker">nested invoker button</button>
            </${tag}>
          </div>
          <button slot="invoker" id="mainInvoker">invoker button</button>
        </${tag}>
      `)
      );

      if (el._overlayCtrl.placementMode === 'global') {
        expect(getGlobalOverlayCtrls().length).to.equal(2);
      }

      el.opened = true;
      await aTimeout(0);
      expect(el._overlayCtrl.contentNode).to.be.displayed;
      const nestedOverlayEl = /** @type {OverlayEl} */ (
        el._overlayCtrl.contentNode.querySelector(tagString)
      );
      nestedOverlayEl.opened = true;
      await aTimeout(0);
      expect(nestedOverlayEl._overlayCtrl.contentNode).to.be.displayed;
    });

    it('[global] allows for moving of the element', async () => {
      const el = /** @type {OverlayEl} */ (
        await fixture(html`
        <${tag}>
          <div slot="content" id="nestedContent">content of the nested overlay</div>
          <button slot="invoker">invoker nested</button>
        </${tag}>
      `)
      );
      if (el._overlayCtrl.placementMode === 'global') {
        expect(getGlobalOverlayCtrls().length).to.equal(1);

        const moveTarget = /** @type {OverlayEl} */ (await fixture('<div id="target"></div>'));
        moveTarget.appendChild(el);
        await el.updateComplete;
        expect(getGlobalOverlayCtrls().length).to.equal(1);
      }
    });

    it('reconstructs the overlay when disconnected and reconnected to DOM (support for nested overlay nodes)', async () => {
      const nestedEl = /** @type {OverlayEl} */ (
        await fixture(html`
        <${tag} id="nest">
          <div slot="content" id="nestedContent">content of the nested overlay</div>
          <button slot="invoker">invoker nested</button>
        </${tag}>
      `)
      );

      const el = /** @type {OverlayEl} */ (
        await fixture(html`
        <${tag} id="main">
          <div slot="content" id="mainContent">
            open nested overlay:
            ${nestedEl}
          </div>
          <button slot="invoker">invoker button</button>
        </${tag}>
      `)
      );

      if (el._overlayCtrl.placementMode === 'global') {
        // Find the outlets that are not backdrop outlets
        expect(getGlobalOverlayCtrls().length).to.equal(2);
        // Check that the last container is the nested one with the intended content
        expect(el.contains(nestedEl)).to.be.true;
      } else {
        const contentNode = /** @type {HTMLElement} */ (
          // @ts-ignore [allow-protected] in tests
          el._overlayContentNode.querySelector('#nestedContent')
        );
        expect(contentNode).to.not.be.null;
        expect(contentNode.innerText).to.equal('content of the nested overlay');
      }
    });
  });
}
