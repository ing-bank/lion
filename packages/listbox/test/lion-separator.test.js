import { expect, fixture, html } from '@open-wc/testing';

import '../lion-separator.js';

// We can skip for mvp. Main goal here is a nice api and
// a straightforward approach for Subclassers
describe.skip('lion-separator', () => {
  it('has the role separator', async () => {
    const el = await fixture(html`
      <lion-separator></lion-separator>
    `);
    expect(el.getAttribute('role')).to.equal('separator');
  });
});
