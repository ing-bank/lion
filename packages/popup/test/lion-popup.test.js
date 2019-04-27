import { expect, fixture, html } from '@open-wc/testing';

import '../lion-popup.js';

describe('lion-popup', () => {
  describe('Basic', () => {
    it('should not be shown by default', async () => {
      const el = await fixture(html`
        <lion-popup>
          <div slot="content" class="popup">Hey there</div>
          <lion-button slot="invoker">Popup button</lion-button>
        </lion-popup>
      `);
      expect(el.querySelector('[slot="content"]').style.display).to.be.equal('none');
    });

    it('should toggle to show content on click', async () => {
      const el = await fixture(html`
        <lion-popup>
          <div slot="content" class="popup">Hey there</div>
          <lion-button slot="invoker">Popup button</lion-button>
        </lion-popup>
      `);
      const invoker = el.querySelector('[slot="invoker"]');
      const eventOnClick = new Event('click');
      invoker.dispatchEvent(eventOnClick);
      await el.updateComplete;
      expect(el.querySelector('[slot="content"]').style.display).to.be.equal('inline-block');
      invoker.dispatchEvent(eventOnClick);
      await el.updateComplete;
      expect(el.querySelector('[slot="content"]').style.display).to.be.equal('none');
    });

    it('should support popup containing html when specified in popup content body', async () => {
      const el = await fixture(html`
        <lion-popup>
          <div slot="content">This is Popup using <strong id="click_overlay">overlay</strong></div>
          <lion-button slot="invoker">Popup button</lion-button>
        </lion-popup>
      `);
      const invoker = el.querySelector('[slot="invoker"]');
      const event = new Event('click');
      invoker.dispatchEvent(event);
      await el.updateComplete;
      expect(el.querySelector('strong')).to.not.be.undefined;
    });
  });

  describe('Accessibility', () => {
    it('should have aria-controls attribute set to the invoker', async () => {
      const el = await fixture(html`
        <lion-popup>
          <div slot="content" class="popup">Hey there</div>
          <lion-button slot="invoker">Popup button</lion-button>
        </lion-popup>
      `);
      const invoker = el.querySelector('[slot="invoker"]');
      expect(invoker.getAttribute('aria-controls')).to.not.be.null;
    });
  });
});
