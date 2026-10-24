import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr, { contains, containsLike } from '@lion/test-runner-screenreader/commands.js';
import '@lion/ui/define/lion-select.js';

/**
 * Screen reader test for <lion-select>.
 *
 * The state is the part that matters: a user has to hear that there is a popup listbox and that it is collapsed.
 *
 * @typedef {import('@lion/ui/select.js').LionSelect} Select
 * @typedef {import('@lion/test-runner-screenreader').SrReader} SrReader
 */

/** @returns {Promise<Select>} */
async function fixtureComponent() {
  const el = /** @type {Select} */ (
    await fixture(html`
      <div>
        <lion-select>
          <label slot="label">Choice</label>
          <select slot="input">
            <option value="a">Item A</option>
            <option value="b">Item B</option>
          </select>
        </lion-select>
        <!-- Somewhere for the focus to go, so it does not leave the page. -->
        <button type="button">Next</button>
      </div>
    `)
  );
  return el;
}

/** @type {SrReader} */
let activeReader;

describe('<lion-select> screen reader', () => {
  before(async () => {
    activeReader = await sr.initialize();
  });

  after(async () => {
    await sr.stop();
  });

  beforeEach(async () => {
    await sr.reset();
  });

  it('announces the select with its label and its state', async () => {
    const el = await fixtureComponent();
    // The wiring itself, independent of how a reader phrases it: axe fails the run when a
    // label, role or state stops being exposed (a reader that words things differently is not
    // a regression, a control that lost its name is).
    const component = /** @type {HTMLElement} */ (el.querySelector('lion-select'));
    await expect(component).to.be.accessible();

    await sr.focus('lion-select');
    // The virtual reader and NVDA speak about what their cursor is on, so both walk onto the control;
    // VoiceOver followed the focus that sr.focus() set. Same split as the input-iban test.
    if (activeReader !== 'voiceover') {
      await sr.next();
      await sr.next();
    }

    await sr.expect({
      virtual: contains(
        'combobox, Choice, a, has popup listbox, not expanded, not disabled, not invalid',
      ),
      nvda: containsLike('Item'),
      voiceover: containsLike('Choice'),
    });
  });
});
