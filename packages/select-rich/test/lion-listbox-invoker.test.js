import { expect, fixture, html } from '@open-wc/testing';

import '../lion-listbox-invoker.js';

describe('lion-listbox-invoker', () => {
  it('should not be shown by default', async () => {
    const el = await fixture(html`
      <lion-listbox-invoker></lion-listbox-invoker>
    `);
    expect(el.querySelector('[slot="content"]').style.display).to.be.equal('none');
  });

  it('can toggle the listbox', async () => {
    const el = await fixture(html`
      <lion-listbox-invoker></lion-listbox-invoker>
    `);
    expect(el.querySelector('[slot="content"]').style.display).to.be.equal('none');
    el.click();
    expect(el.querySelector('[slot="content"]').style.display).to.be.equal('inline-block');
  });

  describe('Keyboard navigation', () => {
    it('opens the listbox with [enter] key', async () => {
      const el = await fixture(html`
        <lion-listbox-invoker></lion-listbox-invoker>
      `);
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await el.updateComplete;
      expect(el.querySelector('[slot="content"]').style.display).to.be.equal('inline-block');
    });

    it('opens the listbox with [space] key', async () => {
      const el = await fixture(html`
        <lion-listbox-invoker></lion-listbox-invoker>
      `);
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space' }));
      await el.updateComplete;
      expect(el.querySelector('[slot="content"]').style.display).to.be.equal('inline-block');
    });

    it('opens the listbox with [arrow down] key and changes focus to listbox', async () => {
      const el = await fixture(html`
        <lion-listbox-invoker></lion-listbox-invoker>
      `);
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await el.updateComplete;
      expect(el.querySelector('[slot="content"]').style.display).to.be.equal('inline-block');
      expect(el.querySelector('[slot="content"]').focus).to.be.true;
    });
  });

  describe('A11y', () => {
    it('has the right aria attributes', async () => {
      const el = await fixture(html`
        <lion-listbox-invoker></lion-listbox-invoker>
      `);
      expect(el.getAttribute('aria-labelledby')).to.equal('ID_REF-label ID_RED-button');
      expect(el.getAttribute('aria-haspopup')).to.equal('listbox');
      expect(el.getAttribute('aria-expanded')).to.be.false;
      el.click();
      expect(el.getAttribute('aria-expanded')).to.be.true;
    });
  });
});
