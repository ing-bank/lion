import { expect, fixture, html } from '@open-wc/testing';

import '../lion-select-rich.js';

describe('lion-select-rich', () => {
  it('can preselect an option', async () => {
    const el = await fixture(html`
      <lion-select-rich .modelValue="${'nr2'}">
        <lion-listbox slot="input">
          <lion-option value="nr1">Item 1</lion-option>
          <lion-option value="nr2">Item 2</lion-option>
        </lion-listbox>
      </lion-select-rich>
    `);
    expect(el.querySelector('button').value).to.equal('nr2');
  });

  it('has a class "state-disabled"', async () => {});

  describe('Interaction states', () => {});

  describe('Validation', () => {
    it('can be required', async () => {
      const lionSelect = await fixture(html`
        <lion-select-rich .errorValidators="${[`required`]}">
          <lion-listbox slot="input">
            <lion-option value="nr1">Item 1</lion-option>
            <lion-option value="nr2">Item 2</lion-option>
          </lion-listbox>
        </lion-select-rich>
      `);
      expect(lionSelect.errorState).to.be.false;
      lionSelect.modelValue = 'nr2';
      expect(lionSelect.errorState).to.be.true;
    });
  });

  describe('A11y', () => {
    it('has the right roles', async () => {
      const lionSelect = await fixture(html`
        <lion-select-rich .modelValue="${'nr2'}">
          <lion-listbox slot="input">
            <lion-option value="nr1">Item 1</lion-option>
            <lion-option value="nr2">Item 2</lion-option>
          </lion-listbox>
        </lion-select-rich>
      `);
      expect(lionSelect.getAttribute('aria-labelledby')).to.equal('label-id');
      expect(lionSelect.getAttribute('aria-haspopup')).to.equal('listbox');
    });
  });

  describe('Invoker', () => {
    it('should not be shown by default', async () => {
      const el = await fixture(html`
        <lion-select-rich></lion-select-rich>
      `);
      expect(el.querySelector('[slot="content"]').style.display).to.be.equal('none');
    });

    it('can toggle the listbox', async () => {
      const el = await fixture(html`
        <lion-select-rich></lion-select-rich>
      `);
      expect(el.querySelector('[slot="content"]').style.display).to.be.equal('none');
      el.click();
      expect(el.querySelector('[slot="content"]').style.display).to.be.equal('inline-block');
    });

    describe('Keyboard navigation', () => {
      it('opens the listbox with [enter] key', async () => {
        const el = await fixture(html`
          <lion-select-rich></lion-select-rich>
        `);
        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        await el.updateComplete;
        expect(el.querySelector('[slot="content"]').style.display).to.be.equal('inline-block');
      });

      it('opens the listbox with [space] key', async () => {
        const el = await fixture(html`
          <lion-select-rich></lion-select-rich>
        `);
        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space' }));
        await el.updateComplete;
        expect(el.querySelector('[slot="content"]').style.display).to.be.equal('inline-block');
      });

      it('opens the listbox with [arrow down] key and changes focus to listbox', async () => {
        const el = await fixture(html`
          <lion-select-rich></lion-select-rich>
        `);
        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        await el.updateComplete;
        expect(el.querySelector('[slot="content"]').style.display).to.be.equal('inline-block');
        expect(el.querySelector('[slot="content"]').focus).to.be.true;
      });
    });

    describe('Accessibility', () => {
      // TODO: elaborate/ split up
      it('has the right aria attributes', async () => {
        const el = await fixture(html`
          <lion-select-rich></lion-select-rich>
        `);
        expect(el.getAttribute('aria-labelledby')).to.equal('ID_REF-label ID_RED-button');
        expect(el.getAttribute('aria-haspopup')).to.equal('listbox');
        expect(el.getAttribute('aria-expanded')).to.be.false;
        el.click();
        expect(el.getAttribute('aria-expanded')).to.be.true;
      });
    });

    it('has tabindex="0" to on the invoker element', async () => {
      const el = await fixture(html`
        <lion-select-rich></lion-select-rich>
      `);
      expect(el._invokerElement.getAttribute('tabindex')).to.equal('-1');
    });

    it('has tabindex="-1" to on role="listbox" element', async () => {
      const el = await fixture(html`
        <lion-select-rich></lion-select-rich>
      `);
      expect(el._listboxElement.getAttribute('tabindex')).to.equal('-1');
    });
  });
});
