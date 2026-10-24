import { fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr, { contains, containsLike } from '@lion/test-runner-screenreader/commands.js';
import '@lion/ui/define/lion-switch.js';

/**
 * Screen reader test for <lion-switch>.
 *
 * A switch that is not announced as a switch (with checked state) reads as a plain text label.
 *
 * @typedef {import('@lion/ui/switch.js').LionSwitch} Switch
 * @typedef {import('@lion/test-runner-screenreader').SrReader} SrReader
 */

/** @returns {Promise<Switch>} */
async function fixtureComponent() {
  const el = /** @type {Switch} */ (
    await fixture(html`
      <div>
        <lion-switch><label slot="label">Notify</label></lion-switch>
        <!-- Somewhere for the focus to go, so it does not leave the page. -->
        <button type="button">Next</button>
      </div>
    `)
  );
  return el;
}

/** @type {SrReader} */
let activeReader;

describe('<lion-switch> screen reader', () => {
  before(async () => {
    activeReader = await sr.initialize();
  });

  after(async () => {
    await sr.stop();
  });

  beforeEach(async () => {
    await sr.reset();
  });

  it('announces the switch with its state', async () => {
    const el = await fixtureComponent();
    void el;

    await sr.focus('lion-switch');
    // The virtual reader and NVDA speak about what their cursor is on, so both walk onto the control;
    // VoiceOver followed the focus that sr.focus() set. Same split as the input-iban test.
    if (activeReader !== 'voiceover') {
      await sr.next();
      await sr.next();
    }

    await sr.expect({
      virtual: contains('switch, Notify, not checked, not disabled, not invalid, not read only'),
      nvda: containsLike('Notify'),
      voiceover: containsLike('Notify'),
    });
  });
});
