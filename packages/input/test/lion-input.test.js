import { expect, fixture } from '@open-wc/testing';

import '../lion-input.js';

describe('<lion-input>', () => {
  it('delegates readOnly property and readonly attribute', async () => {
    const el = await fixture(
      `<lion-input readonly><label slot="label">Testing readonly</label></lion-input>`,
    );
    expect(el.inputElement.readOnly).to.equal(true);
    el.readOnly = false;
    await el.updateComplete;
    expect(el.readOnly).to.equal(false);
    expect(el.inputElement.readOnly).to.equal(false);
  });

  it('delegates "step" attribute and property', async () => {
    const el = await fixture(`<lion-input step="0.01"></lion-input>`);
    expect(el.inputElement.step).to.equal('0.01');
    // TODO: activate when DelegateMixin is refactored
    // const el2 = await fixture(`<lion-input .step="${'0.02'}"></lion-input>`);
    // expect(el2.inputElement.step).to.equal('0.02');
  });

  it('automatically creates an <input> element if not provided by user', async () => {
    const el = await fixture(`<lion-input></lion-input>`);
    expect(el.querySelector('input')).to.equal(el.inputElement);
  });
});
