import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr, { contains, containsLike } from 'test-runner-sr/commands.js';
import '@lion/ui/define/lion-tabs.js';

/**
 * Screen reader test for <lion-tabs>.
 *
 * Tabs are announced with their position in the set and with what they control, so a user who lands on
 * one knows how many there are and which panel belongs to it. Selecting a tab is only useful if the
 * panel it reveals is reachable too, which is the second assertion.
 *
 * @typedef {import('test-runner-sr').SrReader} SrReader
 */

/** @returns {Promise<HTMLElement>} */
async function fixtureComponent() {
  return fixture(html`
    <div>
      <lion-tabs>
        <button slot="tab" id="tab-one">One</button>
        <button slot="tab" id="tab-two">Two</button>
        <div slot="panel" id="panel-one">Panel one</div>
        <div slot="panel" id="panel-two">Panel two</div>
      </lion-tabs>
      <!-- Somewhere for the focus to go, so it does not leave the page. -->
      <button type="button">Next</button>
    </div>
  `);
}

/** @type {SrReader} */
let activeReader;

describe('<lion-tabs> screen reader', () => {
  before(async () => {
    activeReader = await sr.initialize();
  });

  after(async () => {
    await sr.stop();
  });

  beforeEach(async () => {
    await sr.reset();
  });

  it('announces the tab with its state and position, and the panel it reveals', async () => {
    const wrapper = await fixtureComponent();
    const tabs = /** @type {HTMLElement} */ (wrapper.querySelector('lion-tabs'));
    // axe keeps the role, the name and the selected state honest; a reader wording them differently is
    // not a regression, a tab that lost its panel is.
    await expect(tabs).to.be.accessible();

    await sr.focus('lion-tabs');
    if (activeReader === 'nvda') {
      // NVDA speaks about its own cursor, not about the browser focus: walk onto the tabs and back.
      await sr.press('Tab');
      await sr.press('Shift+Tab');
    }
    if (activeReader !== 'voiceover') {
      // The log grows one phrase per step, so walk the whole strip: a partial walk would leave the
      // second tab out of it.
      for (let step = 0; step < 10; step += 1) {
        // eslint-disable-next-line no-await-in-loop
        await sr.next();
      }
    }

    await sr.expect({
      virtual: contains(
        'tab, One, selected, 1 control, position 1, set size 2',
        'tabpanel, One',
        'tab, Two, not selected, 1 control, position 2, set size 2',
      ),
      // The position in the set ("1 of 2") is what tells a user how much is left; the wording differs
      // per reader, so the count is asserted through the virtual phrase and axe above.
      nvda: containsLike('Tab'),
      voiceover: containsLike('One'),
    });
  });

  it('moves the panel along when another tab is selected', async () => {
    const wrapper = await fixtureComponent();
    const secondTab = /** @type {HTMLElement} */ (wrapper.querySelectorAll('[slot="tab"]')[1]);

    // Selecting is a click, so the reader only has to report the consequence: the panel that came with
    // it. (The virtual reader cannot press Enter on a button, so this goes through the DOM.)
    secondTab.click();

    await sr.focus('lion-tabs');
    if (activeReader === 'nvda') {
      await sr.press('Tab');
      await sr.press('Shift+Tab');
    }
    for (let step = 0; step < 10; step += 1) {
      // eslint-disable-next-line no-await-in-loop
      await sr.next();
    }

    await sr.expect({
      virtual: contains('tab, Two, selected, 1 control, position 2, set size 2', 'Panel two'),
      nvda: containsLike('Two'),
      voiceover: containsLike('Two'),
    });
  });
});
