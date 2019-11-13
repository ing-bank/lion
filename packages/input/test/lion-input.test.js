import { expect, fixture } from '@open-wc/testing';

import '../lion-input.js';

describe('<lion-input>', () => {
  it('delegates readOnly property and readonly attribute', async () => {
    const el = await fixture(
      `<lion-input readonly><label slot="label">Testing readonly</label></lion-input>`,
    );
    expect(el._inputNode.readOnly).to.equal(true);
    el.readOnly = false;
    await el.updateComplete;
    expect(el.readOnly).to.equal(false);
    expect(el._inputNode.readOnly).to.equal(false);
  });

  it('automatically creates an <input> element if not provided by user', async () => {
    const el = await fixture(`<lion-input></lion-input>`);
    expect(el.querySelector('input')).to.equal(el._inputNode);
  });

  it('has a type which is reflected to an attribute and is synced down to the native input', async () => {
    const el = await fixture(`<lion-input></lion-input>`);
    expect(el.type).to.equal('text');
    expect(el.getAttribute('type')).to.equal('text');
    expect(el._inputNode.getAttribute('type')).to.equal('text');

    el.type = 'foo';
    await el.updateComplete;
    expect(el.getAttribute('type')).to.equal('foo');
    expect(el._inputNode.getAttribute('type')).to.equal('foo');
  });

  it('has an attribute that can be used to set the placeholder text of the input', async () => {
    const el = await fixture(`<lion-input placeholder="text"></lion-input>`);
    expect(el.getAttribute('placeholder')).to.equal('text');
    expect(el._inputNode.getAttribute('placeholder')).to.equal('text');

    el.placeholder = 'foo';
    await el.updateComplete;
    expect(el.getAttribute('placeholder')).to.equal('foo');
    expect(el._inputNode.getAttribute('placeholder')).to.equal('foo');
  });
});
