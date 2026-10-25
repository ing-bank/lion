import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr, { contains, containsLike } from 'test-runner-sr/commands.js';
import '@lion/ui/define/lion-switch.js';

/**
 * Screen reader test for <lion-switch>.
 *
 * A switch that is not announced as a switch (with checked state) reads as a plain text label.
 *
 * @typedef {import('@lion/ui/switch.js').LionSwitch} Switch
 * @typedef {import('test-runner-sr').SrReader} SrReader
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
    // The wiring itself, independent of how a reader phrases it: axe fails the run when a
    // label, role or state stops being exposed (a reader that words things differently is not
    // a regression, a control that lost its name is).
    const component = /** @type {HTMLElement} */ (el.querySelector('lion-switch'));
    await expect(component).to.be.accessible();

    await sr.focus('lion-switch');
    if (activeReader === 'nvda') {
      // NVDA said nothing about the switch in CI: on a page this small its cursor skips the element the
      // browser focus is on. Tabbing away and back makes it announce it, like the tooltip and
      // input-iban tests do.
      await sr.press('Tab');
      await sr.press('Shift+Tab');
    }
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
