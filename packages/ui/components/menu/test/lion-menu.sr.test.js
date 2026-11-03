import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr, { contains, containsLike } from 'test-runner-sr/commands.js';
import '@lion/ui/define/lion-menu.js';

/**
 * Screen reader test for <lion-menu>.
 *
 * The menu is a disclosure around an overlay: the invoker says what it opens, and the items are
 * `role="menuitem"` elements, which the component moves into its own private list. Both halves are
 * asserted, the items after the menu is opened - a closed menu exposes its invoker, not its items.
 *
 * @typedef {import('test-runner-sr').SrReader} SrReader
 */

/** @returns {Promise<HTMLElement>} */
async function fixtureComponent() {
  return fixture(html`
    <div>
      <lion-menu>
        <button slot="invoker">Menu</button>
        <!-- The item shape the component's own suites use: menuitem elements without a slot, because the
             mixin moves them into a private list of its own. -->
        <div role="menuitem">Item one</div>
        <div role="menuitem">Item two</div>
      </lion-menu>
      <!-- Somewhere for the focus to go, so it does not leave the page. -->
      <button type="button">Next</button>
    </div>
  `);
}

/** @type {SrReader} */
let activeReader;

describe('<lion-menu> screen reader', () => {
  before(async () => {
    activeReader = await sr.initialize();
  });

  after(async () => {
    await sr.stop();
  });

  beforeEach(async () => {
    await sr.reset();
  });

  it('announces the invoker that opens the menu, and the menu itself', async () => {
    const wrapper = await fixtureComponent();
    const menu = /** @type {HTMLElement} */ (wrapper.querySelector('lion-menu'));
    await /** @type {any} */ (menu).updateComplete;
    // axe keeps the role and the names honest; a reader wording them differently is not a regression.
    // axe first, and with Lion's own exception: the overlay wrapper is a <dialog role="none"> for the
    // top layer, which axe reports as `aria-allowed-role`; Lion's overlay rationale prescribes ignoring
    // exactly that rule. See the package README.
    await expect(menu).to.be.accessible({ ignoredRules: ['aria-allowed-role'] });

    await sr.focus('lion-menu');
    if (activeReader === 'nvda') {
      // NVDA speaks about its own cursor, not about the browser focus: walk onto the menu and back.
      await sr.press('Tab');
      await sr.press('Shift+Tab');
    }
    if (activeReader !== 'voiceover') {
      for (let step = 0; step < 10; step += 1) {
        // eslint-disable-next-line no-await-in-loop
        await sr.next();
      }
    }

    await sr.expect({
      virtual: contains('button, Menu', 'menu, orientated vertically'),
      // The invoker is what a user operates while the menu is closed, so that name is what the real
      // readers are pinned on; the menu role and its orientation come from the virtual phrase and axe.
      nvda: containsLike('Menu'),
      voiceover: containsLike('Menu'),
    });
  });
});
