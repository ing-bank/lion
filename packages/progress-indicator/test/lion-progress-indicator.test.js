import { expect, fixture } from '@open-wc/testing';
import { html } from '@lion/core';

import '../lion-progress-indicator.js';

describe('lion-progress-indicator', () => {
  describe('Accessibility', () => {
    it('adds a label', async () => {
      const el = await fixture(html` <lion-progress-indicator></lion-progress-indicator> `);
      expect(el.getAttribute('aria-label')).to.equal('Loading');
    });

    it('sets the right role', async () => {
      const el = await fixture(html` <lion-progress-indicator></lion-progress-indicator> `);
      expect(el.getAttribute('role')).to.equal('status');
    });

    it('sets aria-live to "polite"', async () => {
      const el = await fixture(html` <lion-progress-indicator></lion-progress-indicator> `);
      expect(el.getAttribute('aria-live')).to.equal('polite');
    });
  });
});
