import { expect, fixture, html } from '@open-wc/testing';
// eslint-disable-next-line no-unused-vars
import { LionOptions } from '../src/LionOptions.js';
import '@lion/listbox/define-options';

describe('lion-options', () => {
  it('should have role="listbox"', async () => {
    const registrationTargetEl = document.createElement('div');
    const el = /** @type {LionOptions} */ (await fixture(html`
      <lion-options .registrationTarget=${registrationTargetEl}></lion-options>
    `));
    expect(el.role).to.equal('listbox');
  });
});
