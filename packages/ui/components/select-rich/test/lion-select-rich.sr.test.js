import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr, { contains, containsLike } from 'test-runner-sr/commands.js';
import '@lion/ui/define/lion-select-rich.js';
import '@lion/ui/define/lion-option.js';

/**
 * Screen reader test for <lion-select-rich>.
 *
 * Unlike a native <select>, this one is exposed as a listbox that stays in the page: the options are
 * reachable without opening anything, so the position and set size of every option is what a user
 * navigates by. The invoker is what says it pops something open.
 *
 * @typedef {import('@lion/ui/select-rich.js').LionSelectRich} SelectRich
 * @typedef {import('test-runner-sr').SrReader} SrReader
 */

/** @returns {Promise<HTMLElement>} */
async function fixtureComponent() {
  return fixture(html`
    <div>
      <lion-select-rich name="sel">
        <label slot="label">Choice</label>
        <lion-option .choiceValue=${'a'}>Item A</lion-option>
        <lion-option .choiceValue=${'b'}>Item B</lion-option>
      </lion-select-rich>
      <!-- Somewhere for the focus to go, so it does not leave the page. -->
      <button type="button">Next</button>
    </div>
  `);
}

/** @type {SrReader} */
let activeReader;

describe('<lion-select-rich> screen reader', () => {
  before(async () => {
    activeReader = await sr.initialize();
  });

  after(async () => {
    await sr.stop();
  });

  beforeEach(async () => {
    await sr.reset();
  });

  it('announces a listbox with its options and their position', async () => {
    await fixtureComponent();
    const selectRich = /** @type {SelectRich} */ (document.querySelector('lion-select-rich'));
    // Axe keeps the name, the role and the selected state honest; how a reader words them is what the
    // assertions below are for.
    await expect(selectRich).to.be.accessible();

    // The component generates its own invoker when the consumer does not pass one (the
    // "generates an lion-select-invoker if no invoker is provided" unit test), and *that* element is
    // what carries the popup state. It only exists once the element has updated, which is why the
    // await is here and not in the fixture: a bare `fixture()` resolves the wrapper, not this element.
    await selectRich.updateComplete;
    const invoker = /** @type {HTMLElement} */ (
      selectRich.querySelector('[slot="invoker"]') ||
        selectRich.shadowRoot?.querySelector('lion-select-invoker')
    );
    expect(invoker, 'the component generated its invoker').to.exist;
    expect(invoker.getAttribute('aria-haspopup')).to.equal('listbox');
    expect(invoker.getAttribute('aria-expanded')).to.equal('false');

    await sr.focus('lion-select-rich');
    if (activeReader === 'nvda') {
      // NVDA speaks about its own cursor, not about the browser focus: with the focus on the component
      // the cursor stayed on the button after it, so walk onto the component and back (the same anchor
      // the tooltip test needs on a page this small).
      await sr.press('Tab');
      await sr.press('Shift+Tab');
    }
    if (activeReader !== 'voiceover') {
      // The log grows one phrase per step: walk the listbox and both options before asserting them.
      for (let step = 0; step < 8; step += 1) {
        // eslint-disable-next-line no-await-in-loop
        if ((await sr.phraseLog()).some(phrase => phrase.startsWith('option, Item B'))) {
          break;
        }
        // eslint-disable-next-line no-await-in-loop
        await sr.next();
      }
    }

    await sr.expect({
      virtual: contains(
        'listbox, Choice, orientated vertically, not disabled, not invalid, not multi-selectable',
        'option, Item A, selected, not disabled, position 1, set size 2',
        'option, Item B, not selected, not disabled, position 2, set size 2',
      ),
      // NVDA announces the option it walks onto (with its position in the set) rather than the listbox
      // name; the name is pinned by the virtual phrase and by axe above.
      nvda: containsLike('Item'),
      voiceover: containsLike('Choice'),
    });
  });
});
