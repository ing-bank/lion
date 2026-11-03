import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr, { once } from 'test-runner-sr/commands.js';
import '@lion/ui/define/lion-accordion.js';

/**
 * TEMPORARY PROBE - not a test to keep.
 *
 * The question is how often the summary text is read out: the virtual reader walks the heading
 * and the button, so it says "Summary one" more than once. This run answers the same question for
 * NVDA and VoiceOver by asserting the text is spoken exactly once; the failure (and the workflow
 * now prints the failing file's whole log) shows the real phrase log of both readers, which is
 * what the answer needs. Reverted in the next commit.
 *
 * @typedef {import('test-runner-sr').SrReader} SrReader
 */

/** @type {SrReader} */
let activeReader;

describe('<lion-accordion> how often the summary is read', () => {
  before(async () => {
    activeReader = await sr.initialize();
  });

  after(async () => {
    await sr.stop();
  });

  beforeEach(async () => {
    await sr.reset();
  });

  it('says the summary exactly once (probe)', async () => {
    const wrapper = await fixture(html`
      <div>
        <lion-accordion>
          <h3 slot="invoker"><button>Summary one</button></h3>
          <div slot="content">Content one</div>
          <h3 slot="invoker"><button>Summary two</button></h3>
          <div slot="content">Content two</div>
        </lion-accordion>
        <button type="button">Next</button>
      </div>
    `);
    await expect(
      /** @type {HTMLElement} */ (wrapper.querySelector('lion-accordion')),
    ).to.be.accessible({ ignoredRules: ['aria-allowed-role'] });

    await sr.focus('lion-accordion');
    if (activeReader === 'nvda') {
      await sr.press('Tab');
      await sr.press('Shift+Tab');
    }
    if (activeReader !== 'voiceover') {
      // One pass over the widget: stop when the last section has been announced.
      for (let step = 0; step < 12; step += 1) {
        // eslint-disable-next-line no-await-in-loop
        const log = await sr.phraseLog();
        if (log.some(phrase => phrase.includes('end of heading, Summary two'))) {
          break;
        }
        // eslint-disable-next-line no-await-in-loop
        await sr.next();
      }
    }

    await sr.expect({
      virtual: once('Summary one'),
      nvda: once('Summary one'),
      voiceover: once('Summary one'),
    });
  });
});
