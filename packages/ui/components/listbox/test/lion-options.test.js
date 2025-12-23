import { describe, it } from 'vitest';
import { expect, fixture } from '../../../test-helpers.js';
import { html } from 'lit/static-html.js';
// eslint-disable-next-line no-unused-vars
import { LionOptions } from '@lion/ui/listbox.js';
import '@lion/ui/define/lion-options.js';

describe('lion-options', () => {
  it('should have role="listbox"', async () => {
    const registrationTargetEl = document.createElement('div');
    const el = /** @type {LionOptions} */ (
      await fixture(html`
        <lion-options .registrationTarget=${registrationTargetEl}></lion-options>
      `)
    );
    expect(el.getAttribute('role')).to.equal('listbox');
  });
});
