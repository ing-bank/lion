import { expect, fixture, html } from '@open-wc/testing';

import '../lion-listbox.js';

describe('lion-option', () => {
  it('should use value attribute to set the value', async () => {
    const el = await fixture(html`
      <lion-option value="foo">Item 1</lion-option>
    `);
    expect(el.value).to.equal('foo');
  });

  it('should use the textContent as value as a fallback', async () => {
    const el = await fixture(html`
      <lion-option>Item 1</lion-option>
    `);
    expect(el.value).to.equal('Item 1');
  });

  it('can have different types of values', async () => {
    const el1 = await fixture(html`
      <lion-option value="${1}">Item 1</lion-option>
    `);
    const el2 = await fixture(html`
      <lion-option value="${new Date()}">Item 1</lion-option>
    `);
    expect(el1.value).to.equal(1);
    expect(el2.value).to.equal(new Date());
  });

  describe('A11y', () => {
    it('has the role option', async () => {
      const el = await fixture(html`
        <lion-option value="nr1">Item 1</lion-option>
      `);
      expect(el.getAttribute('role')).to.equal('option');
    });

    it('has aria-selected attribute when selected', async () => {
      const el1 = await fixture(html`
        <lion-option value="nr1">Item 1</lion-option>
      `);
      const el2 = await fixture(html`
        <lion-option value="nr2" selected>Item 2</lion-option>
      `);

      expect(el1.getAttribute('aria-selected')).to.be.false;
      expect(el2.getAttribute('aria-selected')).to.be.true;
    });
  });
});
