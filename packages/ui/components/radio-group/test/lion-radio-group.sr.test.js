import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr, { contains, containsLike } from '@lion/test-runner-screenreader/commands.js';
import '@lion/ui/define/lion-radio-group.js';
import '@lion/ui/define/lion-radio.js';

/**
 * Screen reader test for <lion-radio-group>.
 *
 * The position and set size are what tell a user how many options there are, not the visual layout.
 *
 * @typedef {import('@lion/ui/radio-group.js').LionRadioGroup} RadioGroup
 * @typedef {import('@lion/test-runner-screenreader').SrReader} SrReader
 */

/** @returns {Promise<RadioGroup>} */
async function fixtureComponent() {
  const el = /** @type {RadioGroup} */ (
    await fixture(html`
      <div>
        <lion-radio-group name="rb-group">
          <label slot="label">Pick one</label>
          <lion-radio><label slot="label">A</label></lion-radio>
          <lion-radio><label slot="label">B</label></lion-radio>
        </lion-radio-group>
        <!-- Somewhere for the focus to go, so it does not leave the page. -->
        <button type="button">Next</button>
      </div>
    `)
  );
  return el;
}

/** @type {SrReader} */
let activeReader;

describe('<lion-radio-group> screen reader', () => {
  before(async () => {
    activeReader = await sr.initialize();
  });

  after(async () => {
    await sr.stop();
  });

  beforeEach(async () => {
    await sr.reset();
  });

  it('announces the radio group, its name and the position in the set', async () => {
    const el = await fixtureComponent();

    await sr.focus('lion-radio-group');
    // The virtual reader and NVDA speak about what their cursor is on, so both walk onto the control;
    // VoiceOver followed the focus that sr.focus() set. Same split as the input-iban test. The group
    // is announced before its children, so walk until the radio itself is in the log: how many steps
    // that takes depends on the markup around it.
    if (activeReader !== 'voiceover') {
      for (let step = 0; step < 6; step += 1) {
        // eslint-disable-next-line no-await-in-loop
        if ((await sr.phraseLog()).some(phrase => phrase.startsWith('radio,'))) {
          break;
        }
        // eslint-disable-next-line no-await-in-loop
        await sr.next();
      }
    }

    // Neither real reader announced the group's own name in CI - they announce the control inside it -
    // so the group role stays pinned in the DOM; a user has to hear that these belong together.
    expect(el.querySelector('lion-radio-group')?.getAttribute('role')).to.equal('radiogroup');

    await sr.expect({
      virtual: contains(
        'radiogroup, Pick one, not disabled, not invalid',
        'radio, A, not checked, not disabled, position 0, set size 1',
      ),
      nvda: containsLike('radio button'),
      voiceover: containsLike('radio button'),
    });
  });
});
