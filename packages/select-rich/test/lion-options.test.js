import { expect, fixture, html } from '@open-wc/testing';

import '../lion-options.js';

describe('lion-options', () => {
  it('should have role="listbox"', async () => {
    const el = await fixture(html`
      <lion-options></lion-options>
    `);
    expect(el.role).to.equal('listbox');
  });
});
