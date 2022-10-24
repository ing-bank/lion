import '@lion/ui/define/lion-select.js';
import { aTimeout, expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

/**
 * @typedef {import('../src/LionSelect').LionSelect} LionSelect
 */

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

  it('sets the values correctly based on the option value and view value', async () => {
    const lionSelect = /** @type {LionSelect} */ (
      await fixture(html`
        <lion-select label="Foo item" .modelValue="${'nr2'}">
          <select slot="input">
            <option value="nr1">Item 1</option>
            <option value="nr2">Item 2</option>
            <option value="nr3"></option>
          </select>
        </lion-select>
      `)
    );
    expect(lionSelect.serializedValue).to.equal('nr2');
    expect(lionSelect.formattedValue).to.equal('Item 2');
    lionSelect.modelValue = 'nr1';
    await aTimeout;
    expect(lionSelect.serializedValue).to.equal('nr1');
    expect(lionSelect.formattedValue).to.equal('Item 1');
    lionSelect.modelValue = 'nr3';
    await aTimeout;
    expect(lionSelect.serializedValue).to.equal('nr3');
    expect(lionSelect.formattedValue).to.equal('');
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
