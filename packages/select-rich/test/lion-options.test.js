import { expect, fixture, html } from '@open-wc/testing';

import '../lion-options.js';

describe('lion-options', () => {
  it('should have role="listbox"', async () => {
    const registrationTargetEl = document.createElement('div');
    const el = await fixture(html`
      <lion-options .registrationTarget=${registrationTargetEl}></lion-options>
    `);
    expect(el.role).to.equal('listbox');
  });
});
