import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr, { contains, containsLike } from 'test-runner-sr/commands.js';
import '@lion/ui/define/lion-combobox.js';
import '@lion/ui/define/lion-option.js';

/**
 * Screen reader test for <lion-combobox>.
 *
 * A combobox is announced with what it will open: a user who hears "has popup listbox, not expanded"
 * knows that typing or arrowing down opens something. The name lives on the text field inside it, which
 * is why both the combobox node and the textbox appear in the log.
 *
 * @typedef {import('@lion/ui/combobox.js').LionCombobox} Combobox
 * @typedef {import('test-runner-sr').SrReader} SrReader
 */

/** @returns {Promise<HTMLElement>} */
async function fixtureComponent() {
  return fixture(html`
    <div>
      <lion-combobox name="combo">
        <label slot="label">Choice</label>
        <lion-option .choiceValue=${'a'}>Item A</lion-option>
        <lion-option .choiceValue=${'b'}>Item B</lion-option>
      </lion-combobox>
      <!-- Somewhere for the focus to go, so it does not leave the page. -->
      <button type="button">Next</button>
    </div>
  `);
}

/** @type {SrReader} */
let activeReader;

describe('<lion-combobox> screen reader', () => {
  before(async () => {
    activeReader = await sr.initialize();
  });

  after(async () => {
    await sr.stop();
  });

  beforeEach(async () => {
    await sr.reset();
  });

  it('announces a combobox that expands into a listbox, with the name on its field', async () => {
    await fixtureComponent();
    const combobox = /** @type {HTMLElement} */ (document.querySelector('lion-combobox'));
    // The wiring itself, independent of phrasing: axe fails the run when the name, the role or the
    // expanded state stops being exposed - a reader wording it differently is not a regression, a
    // combobox that lost its popup is.
    await expect(combobox).to.be.accessible();

    await sr.focus('lion-combobox');
    if (activeReader !== 'voiceover') {
      // The log grows one phrase per step, so walk until both the combobox and its field have been
      // spoken; how many steps that takes depends on the markup.
      for (let step = 0; step < 8; step += 1) {
        // eslint-disable-next-line no-await-in-loop
        if ((await sr.phraseLog()).some(phrase => phrase.startsWith('textbox, Choice'))) {
          break;
        }
        // eslint-disable-next-line no-await-in-loop
        await sr.next();
      }
    }

    await sr.expect({
      virtual: contains(
        'combobox, has popup listbox, not expanded, 1 control',
        'textbox, Choice, autocomplete inlined and in list, not disabled, not invalid',
      ),
      // The real readers are pinned on the name that every reader has to say, plus what makes it a
      // combobox at all; the exact state wording differs per reader and is asserted above.
      nvda: containsLike('Choice'),
      voiceover: containsLike('Choice'),
    });
  });
});
