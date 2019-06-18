import { expect, fixture, html } from '@open-wc/testing';

import '../lion-base-listbox.js';

describe('lion-option', () => {
  describe('Accessibility', () => {
    it('has the "option" role', async () => {
      const el = await fixture(html`
        <lion-option></lion-option>
      `);
      expect(el.getAttribute('role')).to.equal('option');
    });

    it('has "aria-selected" attribute when selected', async () => {
      const el1 = await fixture(html`
        <lion-option .choiceValue=${10}>Item 1</lion-option>
      `);
      const el2 = await fixture(html`
        <lion-option .choiceValue=${20} selected>Item 2</lion-option>
      `);

      expect(el1.getAttribute('aria-selected')).to.equal('false');
      expect(el2.getAttribute('aria-selected')).to.equal('true');

      el1.selected = true;
      el2.selected = false;
      expect(el1.getAttribute('aria-selected')).to.equal('true');
      expect(el2.getAttribute('aria-selected')).to.equal('false');
    });

    it('has "aria-disabled" attribute when disabled', async () => {
      const el1 = await fixture(html`
        <lion-option .choiceValue=${10}>Item 1</lion-option>
      `);
      const el2 = await fixture(html`
        <lion-option .choiceValue=${20} disabled>Item 2</lion-option>
      `);

      expect(el1.getAttribute('aria-disabled')).to.equal('false');
      expect(el2.getAttribute('aria-disabled')).to.equal('true');

      el1.disabled = true;
      el2.disabled = false;
      expect(el1.getAttribute('aria-disabled')).to.equal('true');
      expect(el2.getAttribute('aria-disabled')).to.equal('false');
    });
  });
});
