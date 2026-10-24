import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr, { contains, containsLike } from '@lion/test-runner-screenreader/commands.js';
import '@lion/ui/define/lion-input.js';

/**
 * Screen reader test for <lion-input>.
 *
 * The base control every other input builds on: a wrong label or role here is heard in fifteen components.
 *
 * @typedef {import('@lion/ui/input.js').LionInput} Input
 * @typedef {import('@lion/test-runner-screenreader').SrReader} SrReader
 */

/** @returns {Promise<Input>} */
async function fixtureComponent() {
  const el = /** @type {Input} */ (
    await fixture(html`
      <div>
        <lion-input><label slot="label">Name</label></lion-input>
        <!-- Somewhere for the focus to go, so it does not leave the page. -->
        <button type="button">Next</button>
      </div>
    `)
  );
  return el;
}

/** @type {SrReader} */
let activeReader;

describe('<lion-input> screen reader', () => {
  before(async () => {
    activeReader = await sr.initialize();
  });

  after(async () => {
    await sr.stop();
  });

  beforeEach(async () => {
    await sr.reset();
  });

  it('announces the field with its label', async () => {
    const el = await fixtureComponent();
    // The wiring itself, independent of how a reader phrases it: axe fails the run when a
    // label, role or state stops being exposed (a reader that words things differently is not
    // a regression, a control that lost its name is).
    const component = /** @type {HTMLElement} */ (el.querySelector('lion-input'));
    await expect(component).to.be.accessible();

    await sr.focus('lion-input');
    // The virtual reader and NVDA speak about what their cursor is on, so both walk onto the control;
    // VoiceOver followed the focus that sr.focus() set. Same split as the input-iban test.
    if (activeReader !== 'voiceover') {
      await sr.next();
      await sr.next();
    }

    await sr.expect({
      virtual: contains('textbox, Name, not disabled, not invalid'),
      nvda: containsLike('blank'),
      voiceover: containsLike('Name'),
    });
  });
});
