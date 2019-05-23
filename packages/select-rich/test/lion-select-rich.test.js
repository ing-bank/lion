import { expect, fixture, html } from '@open-wc/testing';

import '../lion-select-rich.js';

describe('lion-select-rich', () => {
  it('can preselect an option', async () => {
    const lionSelect = await fixture(html`
      <lion-select-rich .modelValue="${'nr2'}">
        <lion-listbox slot="input">
          <lion-option value="nr1">Item 1</lion-option>
          <lion-option value="nr2">Item 2</lion-option>
        </lion-listbox>
      </lion-select-rich>
    `);
    expect(lionSelect.querySelector('button').value).to.equal('nr2');
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
});
