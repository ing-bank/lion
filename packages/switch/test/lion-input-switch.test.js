import { expect, fixture, html } from '@open-wc/testing';

import '../lion-input-switch.js';

describe('lion-input-switch', () => {
  it('should have default "input" element', async () => {
    const el = await fixture(html`
      <lion-input-switch></lion-input-switch>
    `);
    expect(el.querySelector('[slot="input"]')).not.to.be.null;
  });

  it('should sync its "disabled" state to child button', async () => {
    const el = await fixture(html`
      <lion-input-switch disabled></lion-input-switch>
    `);
    expect(el.inputElement.disabled).to.be.true;
    expect(el.inputElement.hasAttribute('disabled')).to.be.true;
    el.disabled = false;
    await el.updateComplete;
    expect(el.inputElement.disabled).to.be.false;
    expect(el.inputElement.hasAttribute('disabled')).to.be.false;
  });

  it('should sync its "checked" state to child button', async () => {
    const uncheckedEl = await fixture(html`
      <lion-input-switch></lion-input-switch>
    `);
    const checkedEl = await fixture(html`
      <lion-input-switch checked></lion-input-switch>
    `);
    expect(uncheckedEl.inputElement.checked).to.be.false;
    expect(checkedEl.inputElement.checked).to.be.true;
    uncheckedEl.checked = true;
    checkedEl.checked = false;
    await uncheckedEl.updateComplete;
    await checkedEl.updateComplete;
    expect(uncheckedEl.inputElement.checked).to.be.true;
    expect(checkedEl.inputElement.checked).to.be.false;
  });

  it('should sync "checked" state received from child button', async () => {
    const el = await fixture(html`
      <lion-input-switch></lion-input-switch>
    `);
    const button = el.inputElement;
    expect(el.checked).to.be.false;
    button.click();
    expect(el.checked).to.be.true;
    button.click();
    expect(el.checked).to.be.false;
  });

  it('synchronizes modelValue to checked state and vice versa', async () => {
    const el = await fixture(html`
      <lion-input-switch .choiceValue=${'foo'}></lion-input-switch>
    `);
    expect(el.checked).to.be.false;
    expect(el.modelValue).to.deep.equal({
      checked: false,
      value: 'foo',
    });
    el.checked = true;
    expect(el.checked).to.be.true;
    expect(el.modelValue).to.deep.equal({
      checked: true,
      value: 'foo',
    });
  });
});
