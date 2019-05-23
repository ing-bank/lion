import { expect, fixture, html } from '@open-wc/testing';

import '../lion-listbox.js';

describe('lion-option', () => {
  it('should use the textContent as value by default', async () => {
    const el = await fixture(html`
      <lion-option>Item 1</lion-option>
    `);
    expect(el.value).to.equal('Item 1');
  });

  it('should use value attribute to set the value', async () => {
    const el = await fixture(html`
      <lion-option value="foo">Item 1</lion-option>
    `);
    expect(el.value).to.equal('foo');
  });

  describe('A11y', () => {
    it('has the role option', async () => {
      const el = await fixture(html`
        <lion-option>Item 1</lion-option>
      `);
      expect(el.getAttribute('role')).to.equal('option');
    });

    it('has the right aria attributes', async () => {
      const el1 = await fixture(html`
        <lion-option>Item 1</lion-option>
      `);
      const el2 = await fixture(html`
        <lion-option selected>Item 2</lion-option>
      `);

      expect(el1.getAttribute('aria-selected')).to.be.false;
      expect(el2.getAttribute('aria-selected')).to.be.true;
    });
  });
});
