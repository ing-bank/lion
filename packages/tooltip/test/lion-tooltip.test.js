import { expect, fixture, html } from '@open-wc/testing';

import '../lion-tooltip.js';

describe('lion-tooltip', () => {
  describe('Basic', () => {
    it('should not be shown by default', async () => {
      const el = await fixture(html`
        <lion-tooltip>
          <div slot="content">Hey there</div>
          <lion-button slot="invoker">Tooltip button</lion-button>
        </lion-tooltip>
      `);
      expect(el.querySelector('[slot="content"]').style.display).to.be.equal('none');
    });

    it('should show content on mouseenter and hide on mouseleave', async () => {
      const el = await fixture(html`
        <lion-tooltip>
          <div slot="content">Hey there</div>
          <lion-button slot="invoker">Tooltip button</lion-button>
        </lion-tooltip>
      `);
      const invoker = el.querySelector('[slot="invoker"]');
      const eventMouseEnter = new Event('mouseenter');
      invoker.dispatchEvent(eventMouseEnter);
      await el.updateComplete;
      expect(el.querySelector('[slot="content"]').style.display).to.be.equal('inline-block');
      const eventMouseLeave = new Event('mouseleave');
      invoker.dispatchEvent(eventMouseLeave);
      await el.updateComplete;
      expect(el.querySelector('[slot="content"]').style.display).to.be.equal('none');
    });

    it('should tooltip contains html when specified in tooltip content body', async () => {
      const el = await fixture(html`
        <lion-tooltip>
          <div slot="content">
            This is Tooltip using <strong id="click_overlay">overlay</strong>
          </div>
          <lion-button slot="invoker">Tooltip button</lion-button>
        </lion-tooltip>
      `);
      const invoker = el.querySelector('[slot="invoker"]');
      const event = new Event('mouseenter');
      invoker.dispatchEvent(event);
      await el.updateComplete;
      expect(el.querySelector('strong')).to.not.be.undefined;
    });
  });

  describe('Accessibility', () => {
    it('should visible on focusin and hide on focusout', async () => {
      const el = await fixture(html`
        <lion-tooltip>
          <div slot="content">Hey there</div>
          <lion-button slot="invoker">Tooltip button</lion-button>
        </lion-tooltip>
      `);
      const invoker = el.querySelector('[slot="invoker"]');
      const eventFocusIn = new Event('focusin');
      invoker.dispatchEvent(eventFocusIn);
      await el.updateComplete;
      expect(el.querySelector('[slot="content"]').style.display).to.be.equal('inline-block');
      const eventFocusOut = new Event('focusout');
      invoker.dispatchEvent(eventFocusOut);
      await el.updateComplete;
      expect(el.querySelector('[slot="content"]').style.display).to.be.equal('none');
    });

    it('should have aria-controls attribute set to the invoker', async () => {
      const el = await fixture(html`
        <lion-tooltip>
          <div slot="content">Hey there</div>
          <lion-button slot="invoker">Tooltip button</lion-button>
        </lion-tooltip>
      `);
      const invoker = el.querySelector('[slot="invoker"]');
      expect(invoker.getAttribute('aria-controls')).to.not.be.null;
    });
  });
});
