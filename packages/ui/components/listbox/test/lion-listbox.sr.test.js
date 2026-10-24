import { fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr, { contains, containsLike } from '@lion/test-runner-screenreader/commands.js';
import '@lion/ui/define/lion-listbox.js';
import '@lion/ui/define/lion-option.js';

/**
 * Screen reader test for <lion-listbox>.
 *
 * The options carry position and set size, so a user knows how long the list is while walking it.
 *
 * @typedef {import('@lion/ui/listbox.js').LionListbox} Listbox
 * @typedef {import('@lion/test-runner-screenreader').SrReader} SrReader
 */

/** @returns {Promise<Listbox>} */
async function fixtureComponent() {
  const el = /** @type {Listbox} */ (
    await fixture(html`
      <div>
        <lion-listbox name="lb-list">
          <lion-option .choiceValue=${'a'}>Item A</lion-option>
          <lion-option .choiceValue=${'b'}>Item B</lion-option>
        </lion-listbox>
        <!-- Somewhere for the focus to go, so it does not leave the page. -->
        <button type="button">Next</button>
      </div>
    `)
  );
  return el;
}

/** @type {SrReader} */
let activeReader;

describe('<lion-listbox> screen reader', () => {
  before(async () => {
    activeReader = await sr.initialize();
  });

  after(async () => {
    await sr.stop();
  });

  beforeEach(async () => {
    await sr.reset();
  });

  it('announces the listbox and its options with their position', async () => {
    const el = await fixtureComponent();
    void el;

    await sr.focus('lion-listbox');
    // The virtual reader and NVDA speak about what their cursor is on, so both walk onto the control;
    // VoiceOver followed the focus that sr.focus() set. Same split as the input-iban test.
    if (activeReader !== 'voiceover') {
      await sr.next();
      await sr.next();
    }

    await sr.expect({
      virtual: contains(
        'listbox, orientated vertically, not disabled, not invalid, not multi-selectable',
        'option, Item A, not selected, not disabled, position 1, set size 2',
      ),
      nvda: containsLike('Item A'),
      voiceover: containsLike('Item A'),
    });
  });
});
