import { expect, fixture, html } from '@open-wc/testing';

import '../lion-select-rich.js';

describe('lion-select-rich', () => {
  it('has an empty modelValue by default', async () => {
    const el = await fixture(html`
      <lion-select-rich>
        <lion-listbox slot="input">
          <lion-option value="nr1">Item 1</lion-option>
          <lion-option value="nr2">Item 2</lion-option>
        </lion-listbox>
      </lion-select-rich>
    `);
    expect(el.modelValue).to.equal('');
  });

  it('has the selected option as modelValue', async () => {
    const el = await fixture(html`
      <lion-select-rich>
        <lion-listbox slot="input">
          <lion-option value="nr1" selected>Item 1</lion-option>
          <lion-option value="nr2">Item 2</lion-option>
        </lion-listbox>
      </lion-select-rich>
    `);
    expect(el.modelValue).to.equal('nr1');
  });

  it('can preselect an option', async () => {
    const el = await fixture(html`
      <lion-select-rich .modelValue="${'nr2'}">
        <lion-listbox slot="input">
          <lion-option value="nr1">Item 1</lion-option>
          <lion-option value="nr2">Item 2</lion-option>
        </lion-listbox>
      </lion-select-rich>
    `);
    expect(el._listboxElement.value).to.equal('nr2');
  });

  it('shows content of the selected option inside the invoker', async () => {
    const el = await fixture(html`
      <lion-select-rich>
        <lion-listbox slot="input">
          <lion-option value="nr1" selected><span>Item 1</span></lion-option>
        </lion-listbox>
      </lion-select-rich>
    `);
    expect(el._invokerElement.innerHTML).to.equal('<span>Item 1</span>');
  });

  it('has a class "state-disabled"', async () => {});

  describe('Interaction states', () => {});

  describe('Validation', () => {
    it('can be required', async () => {
      const lionSelect = await fixture(html`
        <lion-select-rich name="foo" .errorValidators="${[`required`]}">
          <lion-listbox slot="input">
            <lion-option value="nr1">Item 1</lion-option>
            <lion-option value="nr2">Item 2</lion-option>
          </lion-listbox>
        </lion-select-rich>
      `);
      expect(lionSelect.error.required).to.be.true;
      lionSelect.modelValue = 'nr2';
      expect(lionSelect.error.required).to.be.undefined;
    });
  });

  describe('Invoker', () => {
    it('should be shown closed by default', async () => {
      const el = await fixture(html`
        <lion-select-rich></lion-select-rich>
      `);
      expect(el._listboxElement.style.display).to.be.equal('none');
    });

    it('can toggle the listbox', async () => {
      const el = await fixture(html`
        <lion-select-rich></lion-select-rich>
      `);
      expect(el._listboxElement.style.display).to.be.equal('none');
      el.click();
      expect(el._listboxElement.style.display).to.be.equal('inline-block');
    });

    describe('Keyboard navigation', () => {
      it('opens the listbox with [enter] key', async () => {
        const el = await fixture(html`
          <lion-select-rich></lion-select-rich>
        `);
        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        await el.updateComplete;
        expect(el._listboxElement.style.display).to.be.equal('inline-block');
      });

      it('opens the listbox with [space] key', async () => {
        const el = await fixture(html`
          <lion-select-rich></lion-select-rich>
        `);
        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space' }));
        await el.updateComplete;
        expect(el._listboxElement.style.display).to.be.equal('inline-block');
      });

      it('opens the listbox with [arrow down] key and changes focus to listbox', async () => {
        const el = await fixture(html`
          <lion-select-rich></lion-select-rich>
        `);
        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        await el.updateComplete;
        expect(el.querySelector('[slot="content"]').style.display).to.be.equal('inline-block');
        expect(el._listboxElement.focus).to.be.true;
      });

      it('closes the listbox with [enter] key once opened', async () => {
        const el = await fixture(html`
          <lion-select-rich></lion-select-rich>
        `);
        el.click();
        expect(el._listboxElement.style.display).to.be.equal('inline-block');
        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        await el.updateComplete;
        expect(el._listboxElement.style.display).to.be.equal('none');
        expect(el._invokerElement.focus).to.be.true;
      });

      it('closes the listbox with [esc] key once opened', async () => {
        const el = await fixture(html`
          <lion-select-rich></lion-select-rich>
        `);
        el.click();
        expect(el._listboxElement.style.display).to.be.equal('inline-block');
        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Esc' }));
        await el.updateComplete;
        expect(el._listboxElement.style.display).to.be.equal('none');
        expect(el._invokerElement.focus).to.be.true;
      });

      it('closes the listbox with [tab] key once opened, focuses on next element', async () => {
        const el = await fixture(html`
          <lion-select-rich></lion-select-rich>
          <button></button>
        `);
        const richSelectEl = el.querySelector('lion-rich-select');
        const nextFocusableEl = el.querySelector('button');

        richSelectEl.click();
        expect(richSelectEl._listboxElement.style.display).to.be.equal('inline-block');
        richSelectEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
        await richSelectEl.updateComplete;
        expect(richSelectEl._listboxElement.style.display).to.be.equal('none');
        expect(nextFocusableEl._invokerElement.focus).to.be.true;
      });
    });
  });

  describe('Accessibility', () => {
    it('has the right references to its inner elements', async () => {
      const el = await fixture(html`
        <lion-select-rich></lion-select-rich>
      `);
      expect(el.getAttribute('aria-labelledby')).to.equal('ID_REF-label ID_RED-invoker');
      expect(el.getAttribute('aria-haspopup')).to.equal('listbox');
    });

    it('notifies when the listbox is expanded or now', async () => {
      const el = await fixture(html`
        <lion-select-rich></lion-select-rich>
      `);
      expect(el.getAttribute('aria-expanded')).to.be.false;
      el.click();
      expect(el.getAttribute('aria-expanded')).to.be.true;
    });

    it('has tabindex="0" to on the invoker element', async () => {
      const el = await fixture(html`
        <lion-select-rich></lion-select-rich>
      `);
      expect(el._invokerElement.getAttribute('tabindex')).to.equal('0');
    });

    it('has tabindex="-1" to on role="listbox" element', async () => {
      const el = await fixture(html`
        <lion-select-rich></lion-select-rich>
      `);
      expect(el._listboxElement.getAttribute('tabindex')).to.equal('-1');
    });
  });
});
