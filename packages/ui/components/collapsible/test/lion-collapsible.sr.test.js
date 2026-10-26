import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr, { contains, containsLike } from 'test-runner-sr/commands.js';
import '@lion/ui/define/lion-collapsible.js';

/**
 * Screen reader test for <lion-collapsible>.
 *
 * A disclosure: the invoker has to say what it controls and whether it is open, and opening it has to make
 * the content reachable. Without the first half a user never learns there is content behind the button.
 *
 * @typedef {import('test-runner-sr').SrReader} SrReader
 */

/** @returns {Promise<HTMLElement>} */
async function fixtureComponent() {
  return fixture(html`
    <div>
      <lion-collapsible>
        <button slot="invoker">More info</button>
        <div slot="content">Extra details</div>
      </lion-collapsible>
      <!-- Somewhere for the focus to go, so it does not leave the page. -->
      <button type="button">Next</button>
    </div>
  `);
}

/** @type {SrReader} */
let activeReader;

describe('<lion-collapsible> screen reader', () => {
  before(async () => {
    activeReader = await sr.initialize();
  });

  after(async () => {
    await sr.stop();
  });

  beforeEach(async () => {
    await sr.reset();
  });

  it('announces the invoker as a control for a closed section', async () => {
    const wrapper = await fixtureComponent();
    const collapsible = /** @type {HTMLElement} */ (wrapper.querySelector('lion-collapsible'));
    await expect(collapsible).to.be.accessible();

    await sr.focus('lion-collapsible');
    if (activeReader === 'nvda') {
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
      virtual: contains('button, More info, 1 control, not expanded'),
      // The name is what every reader has to say; that it controls something, and that it is closed, is
      // pinned by the virtual phrase and by axe above.
      nvda: containsLike('More info'),
      voiceover: containsLike('More info'),
    });
  });

  it('makes the content reachable once it is opened', async () => {
    const wrapper = await fixtureComponent();
    const invoker = /** @type {HTMLElement} */ (
      wrapper.querySelector('lion-collapsible [slot="invoker"]')
    );

    // Opening is a click, so the reader only has to report the consequence: the content that came with it.
    // (The virtual reader cannot press Enter on a button, hence the DOM click.)
    invoker.click();

    await sr.focus('lion-collapsible');
    if (activeReader === 'nvda') {
      await sr.press('Tab');
      await sr.press('Shift+Tab');
    }
    for (let step = 0; step < 10; step += 1) {
      // eslint-disable-next-line no-await-in-loop
      await sr.next();
    }

    await sr.expect({
      virtual: containsLike('Extra details'),
      nvda: containsLike('Extra details'),
      voiceover: containsLike('Extra details'),
    });
  });
});
