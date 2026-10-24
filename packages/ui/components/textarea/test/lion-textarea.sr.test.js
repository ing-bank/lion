import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr, { contains, containsLike } from '@lion/test-runner-screenreader/commands.js';
import '@lion/ui/define/lion-textarea.js';

/**
 * Screen reader test for <lion-textarea>.
 *
 * A text area is announced as a textbox as well; what differs is what a user can do with it, not how it is named.
 *
 * @typedef {import('@lion/ui/textarea.js').LionTextarea} Textarea
 * @typedef {import('@lion/test-runner-screenreader').SrReader} SrReader
 */

/** @returns {Promise<Textarea>} */
async function fixtureComponent() {
  const el = /** @type {Textarea} */ (
    await fixture(html`
      <div>
        <lion-textarea><label slot="label">Comment</label></lion-textarea>
        <!-- Somewhere for the focus to go, so it does not leave the page. -->
        <button type="button">Next</button>
      </div>
    `)
  );
  return el;
}

/** @type {SrReader} */
let activeReader;

describe('<lion-textarea> screen reader', () => {
  before(async () => {
    activeReader = await sr.initialize();
  });

  after(async () => {
    await sr.stop();
  });

  beforeEach(async () => {
    await sr.reset();
  });

  it('announces the text area with its label', async () => {
    const el = await fixtureComponent();
    // The wiring itself, independent of how a reader phrases it: axe fails the run when a
    // label, role or state stops being exposed (a reader that words things differently is not
    // a regression, a control that lost its name is).
    const component = /** @type {HTMLElement} */ (el.querySelector('lion-textarea'));
    await expect(component).to.be.accessible();

    await sr.focus('lion-textarea');
    // The virtual reader and NVDA speak about what their cursor is on, so both walk onto the control;
    // VoiceOver followed the focus that sr.focus() set. Same split as the input-iban test.
    if (activeReader !== 'voiceover') {
      await sr.next();
      await sr.next();
    }

    await sr.expect({
      virtual: contains('textbox, Comment, not disabled, not invalid'),
      nvda: containsLike('blank'),
      voiceover: containsLike('Comment'),
    });
  });
});
