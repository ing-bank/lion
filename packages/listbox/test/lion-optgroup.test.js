import { expect, fixture, html } from '@open-wc/testing';

import '../lion-optgroup.js';
import '../lion-option.js';

describe('lion-optgroup', () => {
  it('should have a label', async () => {
    const el = await fixture(html`
      <lion-optgroup label="foo"></lion-optgroup>
    `);
    expect(el.querySelector(['slot="label"'])).lightDom.to.equal('foo');
  });

  it('sets hierarchyLevel to all child options', async () => {
    const el = await fixture(html`
      <lion-optgroup label="foo">
        <lion-option>Foo</lion-option>
      </lion-optgroup>
    `);
    expect(el.querySelectorAll('lion-option').hierarchyLevel).to.equal('1');
  });

  it('setting disabled will disable all child options', async () => {
    const el = await fixture(html`
      <lion-optgroup label="foo" disabled>
        <lion-option>Foo</lion-option>
      </lion-optgroup>
    `);
    expect(el.querySelectorAll('lion-option').disabled).to.be.true;
  });
});
