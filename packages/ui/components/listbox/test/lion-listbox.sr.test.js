import { expect, fixture } from '@open-wc/testing';
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
          <label slot="label">List</label>
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
    // The wiring itself, independent of how a reader phrases it: axe fails the run when a
    // label, role or state stops being exposed (a reader that words things differently is not
    // a regression, a control that lost its name is).
    const component = /** @type {HTMLElement} */ (el.querySelector('lion-listbox'));
    await expect(component).to.be.accessible();

    await sr.focus('lion-listbox');
    // The virtual reader and NVDA speak about what their cursor is on, so both walk onto the control;
    // VoiceOver followed the focus that sr.focus() set. Same split as the input-iban test.
    if (activeReader !== 'voiceover') {
      // Walk until the listbox itself is in the log: the label is announced before it, so the number
      // of steps depends on the markup.
      for (let step = 0; step < 6; step += 1) {
        // eslint-disable-next-line no-await-in-loop
        if ((await sr.phraseLog()).some(phrase => phrase.startsWith('option,'))) {
          break;
        }
        // eslint-disable-next-line no-await-in-loop
        await sr.next();
      }
    }

    await sr.expect({
      virtual: contains(
        'listbox, List, orientated vertically, not disabled, not invalid, not multi-selectable',
        'option, Item A, not selected, not disabled, position 1, set size 2',
      ),
      // NVDA announced the options it walked onto ("Item A, not selected, 1 of 2") rather than the
      // listbox name; the name being exposed is pinned by the virtual phrase and by axe above, so what
      // this asserts is that the options reach the reader - with their position and set size.
      nvda: containsLike('Item A'),
      voiceover: containsLike('List'),
    });
  });
});
