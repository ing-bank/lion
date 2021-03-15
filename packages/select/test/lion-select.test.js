import { expect, fixture, html } from '@open-wc/testing';

import '@lion/select/define';

describe('lion-select', () => {
  it('can preselect an option', async () => {
    const lionSelect = await fixture(html`
      <lion-select .modelValue="${'nr2'}">
        <label slot="label"></label>
        <select slot="input">
          <option value="nr1">Item 1</option>
          <option value="nr2">Item 2</option>
        </select>
      </lion-select>
    `);
    expect(lionSelect.querySelector('select')?.value).to.equal('nr2');
  });

  it('is accessible', async () => {
    const lionSelect = await fixture(html`
      <lion-select .modelValue="${'nr2'}">
        <label slot="label">Label</label>
        <select slot="input">
          <option value="nr1">Item 1</option>
          <option value="nr2">Item 2</option>
        </select>
      </lion-select>
    `);
    await expect(lionSelect).to.be.accessible();
  });
});
