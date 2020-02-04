import { runOverlayMixinSuite } from '@lion/overlays/test-suites/OverlayMixin.suite.js';
import { aTimeout, expect, fixture, html, unsafeStatic } from '@open-wc/testing';
import '../lion-tooltip.js';

describe('lion-tooltip', () => {
  describe('Integration tests', () => {
    const tagString = 'lion-tooltip';
    const tag = unsafeStatic(tagString);

    runOverlayMixinSuite({
      tagString,
      tag,
      suffix: ' for lion-tooltip',
    });
  });

  describe('Basic', () => {
    it('should show content on mouseenter and hide on mouseleave', async () => {
      const el = await fixture(html`
        <lion-tooltip>
          <div slot="content">Hey there</div>
          <button slot="invoker">Tooltip button</button>
        </lion-tooltip>
      `);
      const eventMouseEnter = new Event('mouseenter');
      el.dispatchEvent(eventMouseEnter);
      await el.updateComplete;
      expect(el._overlayCtrl.isShown).to.equal(true);
      const eventMouseLeave = new Event('mouseleave');
      el.dispatchEvent(eventMouseLeave);
      await el.updateComplete;
      expect(el._overlayCtrl.isShown).to.equal(false);
    });

    it('should show content on mouseenter and remain shown on focusout', async () => {
      const el = await fixture(html`
        <lion-tooltip>
          <div slot="content">Hey there</div>
          <button slot="invoker">Tooltip button</button>
        </lion-tooltip>
      `);
      const eventMouseEnter = new Event('mouseenter');
      el.dispatchEvent(eventMouseEnter);
      await el.updateComplete;
      expect(el._overlayCtrl.isShown).to.equal(true);
      const eventFocusOut = new Event('focusout');
      el.dispatchEvent(eventFocusOut);
      await el.updateComplete;
      expect(el._overlayCtrl.isShown).to.equal(true);
    });

    it('should show content on focusin and hide on focusout', async () => {
      const el = await fixture(html`
        <lion-tooltip>
          <div slot="content">Hey there</div>
          <button slot="invoker">Tooltip button</button>
        </lion-tooltip>
      `);
      const invoker = Array.from(el.children).find(child => child.slot === 'invoker');
      const eventFocusIn = new Event('focusin');
      invoker.dispatchEvent(eventFocusIn);
      await el.updateComplete;
      expect(el._overlayCtrl.isShown).to.equal(true);
      const eventFocusOut = new Event('focusout');
      invoker.dispatchEvent(eventFocusOut);
      await el.updateComplete;
      expect(el._overlayCtrl.isShown).to.equal(false);
    });

    it('should show content on focusin and remain shown on mouseleave', async () => {
      const el = await fixture(html`
        <lion-tooltip>
          <div slot="content">Hey there</div>
          <button slot="invoker">Tooltip button</button>
        </lion-tooltip>
      `);
      const invoker = Array.from(el.children).find(child => child.slot === 'invoker');
      const eventFocusIn = new Event('focusin');
      invoker.dispatchEvent(eventFocusIn);
      await el.updateComplete;
      expect(el._overlayCtrl.isShown).to.equal(true);
      const eventMouseLeave = new Event('mouseleave');
      invoker.dispatchEvent(eventMouseLeave);
      await el.updateComplete;
      expect(el._overlayCtrl.isShown).to.equal(true);
    });

    it('should show content on focusin and hide on Escape key press', async () => {
      const el = await fixture(html`
        <lion-tooltip>
          <div slot="content">Hey there</div>
          <button slot="invoker">Tooltip button</button>
        </lion-tooltip>
      `);
      const invoker = Array.from(el.children).find(child => child.slot === 'invoker');
      const eventFocusIn = new Event('focusin');
      invoker.dispatchEvent(eventFocusIn);
      await el.updateComplete;
      expect(el._overlayCtrl.isShown).to.equal(true);
      const eventEscapeKeypress = new KeyboardEvent('keyup', { key: 'Escape' });
      invoker.dispatchEvent(eventEscapeKeypress);
      await el.updateComplete;
      expect(el._overlayCtrl.isShown).to.equal(false);
    });

    it('should show content on mouseenter and hide on Escape key press', async () => {
      const el = await fixture(html`
        <lion-tooltip>
          <div slot="content">Hey there</div>
          <button slot="invoker">Tooltip button</button>
        </lion-tooltip>
      `);
      const eventMouseEnter = new Event('mouseenter');
      el.dispatchEvent(eventMouseEnter);
      await el.updateComplete;
      expect(el._overlayCtrl.isShown).to.equal(true);
      const eventEscapeKeypress = new KeyboardEvent('keyup', { key: 'Escape' });
      document.dispatchEvent(eventEscapeKeypress);
      await el.updateComplete;
      expect(el._overlayCtrl.isShown).to.equal(false);
    });

    it('should tooltip contains html when specified in tooltip content body', async () => {
      const el = await fixture(html`
        <lion-tooltip>
          <div slot="content">
            This is Tooltip using <strong id="click_overlay">overlay</strong>
          </div>
          <button slot="invoker">Tooltip button</button>
        </lion-tooltip>
      `);
      const invoker = Array.from(el.children).find(child => child.slot === 'invoker');
      const event = new Event('mouseenter');
      invoker.dispatchEvent(event);
      await el.updateComplete;
      expect(el.querySelector('strong')).to.not.be.undefined;
    });
  });

  describe('Positioning', () => {
    it('updates popper positioning correctly, without overriding other modifiers', async () => {
      const el = await fixture(html`
        <lion-tooltip style="position: absolute; top: 100px" opened>
          <div slot="content">Hey there</div>
          <div slot="invoker">Tooltip button</div>
        </lion-tooltip>
      `);

      await aTimeout();
      const initialPopperModifiers = el._overlayCtrl.config.popperConfig.modifiers;
      expect(el._overlayCtrl.config.popperConfig.placement).to.equal('top');
      // TODO: this fails in CI, we need to investigate why in CI
      // the value of the transform is: translate3d(16px, -26px, 0px)'
      // expect(el.querySelector('[slot=_overlay-shadow-outlet]').style.transform).to.equal(
      //   'translate3d(15px, -26px, 0px)',
      // );

      el.config = {
        popperConfig: {
          placement: 'bottom',
        },
      };

      el.opened = false;
      el.opened = true;
      await aTimeout();
      const updatedPopperModifiers = el._overlayCtrl.config.popperConfig.modifiers;
      expect(updatedPopperModifiers).to.deep.equal(initialPopperModifiers);
      expect(el._overlayCtrl.config.popperConfig.placement).to.equal('bottom');
      // TODO: this fails in CI, we need to investigate why in CI
      // the value of the transform is: translate3d(16px, 26px, 0px)'
      // expect(el.querySelector('[slot=_overlay-shadow-outlet]').style.transform).to.equal(
      //   'translate3d(15px, 26px, 0px)',
      // );
    });
  });

  describe('Accessibility', () => {
    it('should have a tooltip role set on the tooltip', async () => {
      const el = await fixture(html`
        <lion-tooltip>
          <div slot="content">Hey there</div>
          <button slot="invoker">Tooltip button</button>
        </lion-tooltip>
      `);

      // FIXME: This should be refactored to Array.from(this.children).find(child => child.slot === 'content')
      // When this issue is fixed https://github.com/ing-bank/lion/issues/382
      const content = el.querySelector('[slot=content]');
      expect(content.getAttribute('role')).to.be.equal('tooltip');
    });

    it('should be accessible when closed', async () => {
      const el = await fixture(html`
        <lion-tooltip>
          <div slot="content">Hey there</div>
          <button slot="invoker">Tooltip button</button>
        </lion-tooltip>
      `);
      await expect(el).to.be.accessible;
    });

    it('should be accessible when opened', async () => {
      const el = await fixture(html`
        <lion-tooltip>
          <div slot="content">Hey there</div>
          <button slot="invoker">Tooltip button</button>
        </lion-tooltip>
      `);
      const invoker = el.querySelector('[slot="invoker"]');
      const eventFocusIn = new Event('focusin');
      invoker.dispatchEvent(eventFocusIn);
      await el.updateComplete;

      await expect(el).to.be.accessible;
    });
  });
});
