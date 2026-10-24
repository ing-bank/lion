import { fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr, { contains, containsLike } from '@lion/test-runner-screenreader/commands.js';
import '@lion/ui/define/lion-checkbox-group.js';
import '@lion/ui/define/lion-checkbox.js';

/**
 * Screen reader test for <lion-checkbox-group>.
 *
 * A group has to be announced as a group with its own name, or a user hears loose checkboxes without knowing what they belong to.
 *
 * @typedef {import('@lion/ui/checkbox-group.js').LionCheckboxGroup} CheckboxGroup
 * @typedef {import('@lion/test-runner-screenreader').SrReader} SrReader
 */

/** @returns {Promise<CheckboxGroup>} */
async function fixtureComponent() {
  const el = /** @type {CheckboxGroup} */ (
    await fixture(html`
      <div>
        <lion-checkbox-group name="cb-group">
          <label slot="label">Pick</label>
          <lion-checkbox><label slot="label">A</label></lion-checkbox>
          <lion-checkbox><label slot="label">B</label></lion-checkbox>
        </lion-checkbox-group>
        <!-- Somewhere for the focus to go, so it does not leave the page. -->
        <button type="button">Next</button>
      </div>
    `)
  );
  return el;
}

/** @type {SrReader} */
let activeReader;

describe('<lion-checkbox-group> screen reader', () => {
  before(async () => {
    activeReader = await sr.initialize();
  });

  after(async () => {
    await sr.stop();
  });

  beforeEach(async () => {
    await sr.reset();
  });

  it('announces the group and the checkbox inside it', async () => {
    const el = await fixtureComponent();
    void el;

    await sr.focus('lion-checkbox-group');
    // The virtual reader and NVDA speak about what their cursor is on, so both walk onto the control;
    // VoiceOver followed the focus that sr.focus() set. Same split as the input-iban test. The group
    // is announced before its children, so walk until the checkbox itself is in the log: how many steps
    // that takes depends on the markup around it.
    if (activeReader !== 'voiceover') {
      for (let step = 0; step < 6; step += 1) {
        // eslint-disable-next-line no-await-in-loop
        if ((await sr.phraseLog()).some(phrase => phrase.startsWith('checkbox,'))) {
          break;
        }
        // eslint-disable-next-line no-await-in-loop
        await sr.next();
      }
    }

    await sr.expect({
      virtual: contains(
        'group, Pick, not disabled',
        'checkbox, A, not checked, not disabled, not invalid',
      ),
      nvda: containsLike('Pick'),
      voiceover: containsLike('Pick'),
    });
  });
});
