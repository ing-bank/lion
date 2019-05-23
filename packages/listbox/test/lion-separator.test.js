import { expect, fixture, html } from '@open-wc/testing';

import '../lion-separator.js';

describe('lion-separator', () => {
  it('has the role separator', async () => {
    const el = await fixture(html`
      <lion-separator></lion-separator>
    `);
    expect(el.getAttribute('role')).to.equal('separator');
  });
});
