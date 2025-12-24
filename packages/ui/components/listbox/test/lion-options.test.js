import { describe, it } from 'vitest';
import { html } from 'lit/static-html.js';
import { fixture } from '@open-wc/testing-helpers';
import { expect } from '../../../test-helpers.js';
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
