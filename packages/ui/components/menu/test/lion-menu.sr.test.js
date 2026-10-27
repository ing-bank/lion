import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr, { contains, containsLike } from 'test-runner-sr/commands.js';
import '@lion/ui/define/lion-menu.js';
import '@lion/ui/define/lion-menuitem.js';

/**
 * Screen reader test for <lion-menu>.
 *
 * The invoker is what tells a user a menu exists, and the items are what the menu is for. Both halves have
 * to be reachable: the invoker by name, the items by name and by where they sit in the menu.
 *
 * @typedef {import('test-runner-sr').SrReader} SrReader
 */

/** @returns {Promise<HTMLElement>} */
async function fixtureComponent() {
  return fixture(html`
    <div>
      <lion-menu>
        <button slot="invoker">Menu</button>
        <lion-menu-item slot="item">Item one</lion-menu-item>
        <lion-menu-item slot="item">Item two</lion-menu-item>
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
    // axe keeps the role and the names honest; a reader wording them differently is not a regression, a
    // menu whose items lost their place in the menu is.
    await expect(menu).to.be.accessible();

    await sr.focus('lion-menu');
    if (activeReader === 'nvda') {
      // NVDA speaks about its own cursor, not about the browser focus: walk onto the menu and back.
      await sr.press('Tab');
      await sr.press('Shift+Tab');
    }
    if (activeReader !== 'voiceover') {
      // The log grows one phrase per step, so walk the whole menu.
      for (let step = 0; step < 12; step += 1) {
        // eslint-disable-next-line no-await-in-loop
        await sr.next();
      }
    }

    await sr.expect({
      virtual: contains('button, Menu', 'Item one', 'Item two', 'menu, orientated vertically'),
      // NVDA stayed on the invoker for a closed menu and never reached the items, which is the honest
      // behaviour: they are not rendered until it opens (see the second test). So the name here is the
      // invoker's, and what the spec-modelling virtual reader says about the items is pinned by the
      // virtual phrase - a good illustration of where the layers differ.
      nvda: containsLike('Menu'),
      voiceover: containsLike('Menu'),
    });
  });

  it('makes the items reachable once the menu is opened', async () => {
    const wrapper = await fixtureComponent();
    const invoker = /** @type {HTMLElement} */ (
      wrapper.querySelector('lion-menu [slot="invoker"]')
    );

    // Opening is a click, so the reader only has to report the consequence: the items that came with it.
    invoker.click();

    await sr.focus('lion-menu');
    if (activeReader === 'nvda') {
      await sr.press('Tab');
      await sr.press('Shift+Tab');
    }
    for (let step = 0; step < 12; step += 1) {
      // eslint-disable-next-line no-await-in-loop
      await sr.next();
    }

    await sr.expect({
      virtual: containsLike('Item one'),
      nvda: containsLike('Item'),
      voiceover: containsLike('Item'),
    });
  });
});
