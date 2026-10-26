import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr, { contains, containsLike } from 'test-runner-sr/commands.js';
import '@lion/ui/define/lion-drawer.js';

/**
 * Screen reader test for <lion-drawer>.
 *
 * The invoker is the whole interface of a closed drawer: it has to say that it opens something and that
 * the drawer is currently closed, or a user never learns there is a drawer at all. What the drawer says
 * once it is open is a separate matter - it is an overlay, and an overlay renders outside the subtree of
 * the test, which needs its own anchoring per reader (as the dialog and tooltip tests show). That part
 * therefore follows the drawer's own overlay wiring rather than being guessed here.
 *
 * @typedef {import('test-runner-sr').SrReader} SrReader
 */

/** @returns {Promise<HTMLElement>} */
async function fixtureComponent() {
  return fixture(html`
    <div>
      <lion-drawer>
        <button slot="invoker">Open drawer</button>
        <div slot="content">Drawer content</div>
      </lion-drawer>
      <!-- Somewhere for the focus to go, so it does not leave the page. -->
      <button type="button">Next</button>
    </div>
  `);
}

/** @type {SrReader} */
let activeReader;

describe('<lion-drawer> screen reader', () => {
  before(async () => {
    activeReader = await sr.initialize();
  });

  after(async () => {
    await sr.stop();
  });

  beforeEach(async () => {
    await sr.reset();
  });

  it('announces the invoker as a control that opens a closed drawer', async () => {
    const wrapper = await fixtureComponent();
    const drawer = /** @type {HTMLElement} */ (wrapper.querySelector('lion-drawer'));
    await expect(drawer).to.be.accessible();

    await sr.focus('lion-drawer');
    if (activeReader === 'nvda') {
      // NVDA speaks about its own cursor, not about the browser focus.
      await sr.press('Tab');
      await sr.press('Shift+Tab');
    }
    if (activeReader !== 'voiceover') {
      for (let step = 0; step < 8; step += 1) {
        // eslint-disable-next-line no-await-in-loop
        await sr.next();
      }
    }

    await sr.expect({
      virtual: contains('button, Open drawer, 1 control, not expanded'),
      // The name is what every reader has to say; that it expands and its state are pinned by the
      // virtual phrase and by axe above.
      nvda: containsLike('Open drawer'),
      voiceover: containsLike('Open drawer'),
    });
  });
});
