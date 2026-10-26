import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr, { contains, containsLike } from 'test-runner-sr/commands.js';
import '@lion/ui/define/lion-accordion.js';

/**
 * Screen reader test for <lion-accordion>.
 *
 * The summary of a section is a button inside a heading, so a user hears both the heading level (which
 * is how sections are navigated) and that the button controls something which is currently closed.
 * Without the second half the heading is just text and nothing says a section can be opened.
 *
 * @typedef {import('test-runner-sr').SrReader} SrReader
 */

/** @returns {Promise<HTMLElement>} */
async function fixtureComponent() {
  return fixture(html`
    <div>
      <lion-accordion>
        <h3 slot="invoker"><button>Summary one</button></h3>
        <div slot="content">Content one</div>
        <h3 slot="invoker"><button>Summary two</button></h3>
        <div slot="content">Content two</div>
      </lion-accordion>
      <!-- Somewhere for the focus to go, so it does not leave the page. -->
      <button type="button">Next</button>
    </div>
  `);
}

/** @type {SrReader} */
let activeReader;

describe('<lion-accordion> screen reader', () => {
  before(async () => {
    activeReader = await sr.initialize();
  });

  after(async () => {
    await sr.stop();
  });

  beforeEach(async () => {
    await sr.reset();
  });

  it('announces the summary as a heading with a button that controls a closed section', async () => {
    const wrapper = await fixtureComponent();
    const accordion = /** @type {HTMLElement} */ (wrapper.querySelector('lion-accordion'));
    await expect(accordion).to.be.accessible();

    await sr.focus('lion-accordion');
    if (activeReader === 'nvda') {
      await sr.press('Tab');
      await sr.press('Shift+Tab');
    }
    if (activeReader !== 'voiceover') {
      // The log grows one phrase per step, so walk the whole accordion.
      for (let step = 0; step < 10; step += 1) {
        // eslint-disable-next-line no-await-in-loop
        await sr.next();
      }
    }

    await sr.expect({
      virtual: contains(
        'button, Summary one, 1 control, not expanded',
        'heading, Summary two, level 3',
      ),
      // A heading is what a user navigates by, so both real readers announce the level; the wording of
      // the level and of the collapsed state differs, so those stay with the virtual phrase and axe.
      nvda: containsLike('Summary one'),
      voiceover: containsLike('Summary'),
    });
  });

  it('says the section is expanded and reads its content once it is opened', async () => {
    const wrapper = await fixtureComponent();
    // The component replaces `slot="invoker"` with a class while it wires the sections up, which is why
    // this selects on `.invoker` - the same hook the accordion's own tests use.
    const firstInvoker = /** @type {HTMLElement} */ (
      wrapper.querySelector('lion-accordion .invoker button')
    );

    // Opening is a click, so the reader only has to report the consequence. (The virtual reader cannot
    // press Enter on a button, hence the DOM click.)
    firstInvoker.click();

    await sr.focus('lion-accordion');
    if (activeReader === 'nvda') {
      await sr.press('Tab');
      await sr.press('Shift+Tab');
    }
    for (let step = 0; step < 12; step += 1) {
      // eslint-disable-next-line no-await-in-loop
      await sr.next();
    }

    await sr.expect({
      virtual: contains('button, Summary one, 1 control, expanded', 'Content one'),
      nvda: containsLike('Content one'),
      voiceover: containsLike('Content one'),
    });
  });
});
