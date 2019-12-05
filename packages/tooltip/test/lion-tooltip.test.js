import { expect, fixture, html, unsafeStatic } from '@open-wc/testing';
import { runOverlayMixinSuite } from '@lion/overlays/test-suites/OverlayMixin.suite.js';

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
  });
});
