import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import { sendMouse } from '@web/test-runner-commands';
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

/**
 * Open the menu the way the component expects: a real interaction. A programmatic `.click()` is ignored,
 * because the component listens for real pointer and keyboard events - so this goes through the reader for
 * a real reader (its own Enter press) and through `sendMouse` for the virtual one.
 *
 * @param {HTMLElement} wrapper
 * @param {HTMLElement} menu
 * @param {SrReader} reader
 */
async function openMenu(wrapper, menu, reader) {
  const invoker = /** @type {HTMLElement} */ (wrapper.querySelector('lion-menu [slot="invoker"]'));
  if (reader === 'virtual') {
    const { x, y, width, height } = invoker.getBoundingClientRect();
    await sendMouse({
      type: 'click',
      position: [Math.round(x + width / 2), Math.round(y + height / 2)],
    });
  } else {
    await sr.focus('lion-menu');
    await sr.press('Enter');
  }
  await /** @type {any} */ (menu).updateComplete;
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
    await expect(menu).to.be.accessible();

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

  it('announces the items once the menu is opened', async () => {
    const wrapper = await fixtureComponent();
    const menu = /** @type {HTMLElement} */ (wrapper.querySelector('lion-menu'));
    await /** @type {any} */ (menu).updateComplete;

    await openMenu(wrapper, menu, activeReader);

    if (activeReader !== 'voiceover') {
      for (let step = 0; step < 10; step += 1) {
        // eslint-disable-next-line no-await-in-loop
        await sr.next();
      }
    }

    await sr.expect({
      virtual: contains(
        'menuitem, Item one, not current item, position 1, set size 2',
        'menuitem, Item two, not current item, position 2, set size 2',
      ),
      // The items are what a user operates, so their names are what every reader has to say; the role,
      // the position and the set size come from the virtual phrase and from the component's own DOM.
      nvda: containsLike('Item'),
      voiceover: containsLike('Item'),
    });
  });
});
