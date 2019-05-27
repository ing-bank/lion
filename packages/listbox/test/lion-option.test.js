import { expect, fixture, html } from '@open-wc/testing';

import '../lion-listbox.js';

describe('lion-option', () => {
  it('uses value attribute to set the value', async () => {
    const el = await fixture(html`
      <lion-option value="foo">Item 1</lion-option>
    `);
    expect(el.value).to.equal('foo');
  });

  it('uses the textContent value as a fallback', async () => {
    const el = await fixture(html`
      <lion-option>Item 1</lion-option>
    `);
    expect(el.value).to.equal('Item 1');
  });

  // TODO: for now nice to have, probablyn ot needed
  it.skip('can have different types of values', async () => {
    const today = new Date();
    const el1 = await fixture(html`
      <lion-option .modelValue="${1}">Item 1</lion-option>
    `);
    const el2 = await fixture(html`
      <lion-option .modelValue="${today}">Item 1</lion-option>
    `);
    expect(el1.modelValue).to.equal(1);
    expect(el2.modelValue).to.equal(today);
  });

  describe('Accessibility', () => {
    it('has the "option" role', async () => {
      const el = await fixture(html`
        <lion-option value="nr1">Item 1</lion-option>
      `);
      expect(el.getAttribute('role')).to.equal('option');
    });

    it('has "aria-selected" attribute when selected', async () => {
      const el1 = await fixture(html`
        <lion-option value="nr1">Item 1</lion-option>
      `);
      const el2 = await fixture(html`
        <lion-option value="nr2" selected>Item 2</lion-option>
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
        <lion-option value="nr1">Item 1</lion-option>
      `);
      const el2 = await fixture(html`
        <lion-option value="nr2" disabled>Item 2</lion-option>
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
