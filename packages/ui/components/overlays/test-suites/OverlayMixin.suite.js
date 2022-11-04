import { expect, fixture, html, nextFrame, aTimeout } from '@open-wc/testing';

import sinon from 'sinon';
import { overlays, OverlayController } from '@lion/ui/overlays.js';

import '@lion/ui/define/lion-dialog.js';

/**
 * @typedef {import('../types/OverlayConfig.js').OverlayConfig} OverlayConfig
 * @typedef {import('../types/OverlayMixinTypes.js').DefineOverlayConfig} DefineOverlayConfig
 * @typedef {import('../types/OverlayMixinTypes.js').OverlayHost} OverlayHost
 * @typedef {import('../types/OverlayMixinTypes.js').OverlayMixin} OverlayMixin
 * @typedef {import('lit').LitElement} LitElement
 * @typedef {LitElement & OverlayHost & {_overlayCtrl:OverlayController}} OverlayEl
 */

function getGlobalOverlayNodes() {
  return Array.from(overlays.globalRootNode.children).filter(
    child => !child.classList.contains('global-overlays__backdrop'),
  );
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
      const { offsetWidth, offsetHeight } = /** @type {HTMLElement} */ (
        elWithBigParent.offsetParent
      );
      await elWithBigParent._overlayCtrl.show();
      expect(elWithBigParent.opened).to.be.true;
      expect(/** @type {HTMLElement} */ (elWithBigParent?.offsetParent).offsetWidth).to.equal(
        offsetWidth,
      );
      expect(/** @type {HTMLElement} */ (elWithBigParent?.offsetParent).offsetHeight).to.equal(
        offsetHeight,
      );
      await elWithBigParent._overlayCtrl.hide();
      expect(/** @type {HTMLElement} */ (elWithBigParent?.offsetParent).offsetWidth).to.equal(
        offsetWidth,
      );
      expect(/** @type {HTMLElement} */ (elWithBigParent?.offsetParent).offsetHeight).to.equal(
        offsetHeight,
      );
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
      const closeBtn = /** @type {OverlayEl} */ (
        await fixture(html` <button @click=${sendCloseEvent}>close</button> `)
      );

      const el = /** @type {OverlayEl} */ (
        await fixture(html`
        <${tag} opened>
          <div slot="content">
            content of the overlay
            ${closeBtn}
          </div>
          <button slot="invoker">invoker button</button>
        </${tag}>
      `)
      );
      closeBtn.click();
      await nextFrame(); // hide takes at least a frame
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
      const globalRootNode = document.querySelector('.global-overlays');
      if (globalRootNode) {
        globalRootNode.innerHTML = '';
      }
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
        expect(getGlobalOverlayNodes().length).to.equal(2);
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
        expect(getGlobalOverlayNodes().length).to.equal(1);

        const moveTarget = /** @type {OverlayEl} */ (await fixture('<div id="target"></div>'));
        moveTarget.appendChild(el);
        await el.updateComplete;
        expect(getGlobalOverlayNodes().length).to.equal(1);
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
        const overlayContainerNodes = getGlobalOverlayNodes();
        expect(overlayContainerNodes.length).to.equal(2);
        const lastContentNodeInContainer = overlayContainerNodes[1];
        // Check that the last container is the nested one with the intended content
        expect(lastContentNodeInContainer.firstElementChild.firstChild.textContent).to.equal(
          'content of the nested overlay',
        );
        expect(lastContentNodeInContainer.firstElementChild.slot).to.equal('content');
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
