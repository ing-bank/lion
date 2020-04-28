import { expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';
import '../lion-option.js';

describe('lion-option', () => {
  describe('Values', () => {
    it('has a modelValue', async () => {
      const el = await fixture(html`<lion-option .choiceValue=${10}></lion-option>`);
      expect(el.modelValue).to.deep.equal({ value: 10, checked: false });
    });

    it('can be checked', async () => {
      const el = await fixture(html`<lion-option .choiceValue=${10} checked></lion-option>`);
      expect(el.modelValue).to.deep.equal({ value: 10, checked: true });
    });

    it('is hidden when attribute hidden is true', async () => {
      const el = await fixture(html`<lion-option .choiceValue=${10} hidden></lion-option>`);
      expect(el).not.to.be.displayed;
    });
  });

  describe('Accessibility', () => {
    it('has the "option" role', async () => {
      const el = await fixture(html`<lion-option></lion-option>`);
      expect(el.getAttribute('role')).to.equal('option');
    });

    it('has "aria-selected" attribute when checked', async () => {
      const el = await fixture(html`
        <lion-option .choiceValue=${10} checked>Item 1</lion-option>
      `);
      expect(el.getAttribute('aria-selected')).to.equal('true');

      el.checked = false;
      // check that dom update is async
      expect(el.getAttribute('aria-selected')).to.equal('true');

      await el.updateComplete;
      expect(el.getAttribute('aria-selected')).to.equal('false');
    });

    it('asynchronously adds the attributes "aria-disabled" and "disabled" when disabled', async () => {
      const el = await fixture(html`
        <lion-option .choiceValue=${10} disabled>Item 1</lion-option>
      `);
      expect(el.getAttribute('aria-disabled')).to.equal('true');
      expect(el.hasAttribute('disabled')).to.be.true;

      el.disabled = false;
      expect(el.getAttribute('aria-disabled')).to.equal('true');
      expect(el.hasAttribute('disabled')).to.be.true;

      await el.updateComplete;
      expect(el.getAttribute('aria-disabled')).to.equal('false');
      expect(el.hasAttribute('disabled')).to.be.false;
    });
  });

  describe('State reflection', () => {
    it('asynchronously adds the attribute "active" when active', async () => {
      const el = await fixture(html`<lion-option .choiceValue=${10}></lion-option>`);
      expect(el.active).to.equal(false);
      expect(el.hasAttribute('active')).to.be.false;

      el.active = true;
      expect(el.active).to.be.true;
      expect(el.hasAttribute('active')).to.be.false;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.true;

      el.active = false;
      expect(el.active).to.be.false;
      expect(el.hasAttribute('active')).to.be.true;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.false;
    });

    it('does become checked on [click]', async () => {
      const el = await fixture(html`<lion-option .choiceValue=${10}></lion-option>`);
      expect(el.checked).to.be.false;
      el.click();
      await el.updateComplete;
      expect(el.checked).to.be.true;
    });

    it('fires active-changed event', async () => {
      const activeSpy = sinon.spy();
      const el = await fixture(html`
        <lion-option .choiceValue=${10} @active-changed="${activeSpy}"></lion-option>
      `);
      expect(activeSpy.callCount).to.equal(0);
      el.active = true;
      expect(activeSpy.callCount).to.equal(1);
    });
  });

  describe('Disabled', () => {
    it('does not becomes active on [mouseenter]', async () => {
      const el = await fixture(html`<lion-option .choiceValue=${10} disabled></lion-option>`);
      expect(el.active).to.be.false;
      el.dispatchEvent(new Event('mouseenter'));
      expect(el.active).to.be.false;
    });

    it('does not become checked on [click]', async () => {
      const el = await fixture(html`<lion-option .choiceValue=${10} disabled></lion-option>`);
      expect(el.checked).to.be.false;
      el.click();
      await el.updateComplete;
      expect(el.checked).to.be.false;
    });

    it('does not become un-active on [mouseleave]', async () => {
      const el = await fixture(html`
        <lion-option .choiceValue=${10} active disabled></lion-option>
      `);
      expect(el.active).to.be.true;
      el.dispatchEvent(new Event('mouseleave'));
      expect(el.active).to.be.true;
    });
  });
});
