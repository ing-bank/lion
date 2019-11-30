import { expect, fixture, html, unsafeStatic } from '@open-wc/testing';
import { runOverlayMixinSuite } from '@lion/overlays/test-suites/OverlayMixin.suite.js';

import '../lion-dialog.js';

describe('lion-dialog', () => {
  describe('Integration tests', () => {
    const tagString = 'lion-dialog';
    const tag = unsafeStatic(tagString);

    runOverlayMixinSuite({
      tagString,
      tag,
      suffix: ' for lion-dialog',
    });
  });

  describe('Basic', () => {
    it('should show content on invoker click', async () => {
      const el = await fixture(html`
        <lion-dialog>
          <div slot="content" class="dialog">
            Hey there
          </div>
          <button slot="invoker">Popup button</button>
        </lion-dialog>
      `);
      const invoker = el.querySelector('[slot="invoker"]');
      invoker.click();

      expect(el.opened).to.be.true;
    });
  });
});
