import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr, { contains, containsLike } from 'test-runner-sr/commands.js';
import '@lion/ui/define/lion-checkbox-group.js';
import '@lion/ui/define/lion-checkbox.js';

/**
 * Screen reader test for <lion-checkbox-group>.
 *
 * A group has to be announced as a group with its own name, or a user hears loose checkboxes without knowing what they belong to.
 *
 * @typedef {import('@lion/ui/checkbox-group.js').LionCheckboxGroup} CheckboxGroup
 * @typedef {import('test-runner-sr').SrReader} SrReader
 */

/** @returns {Promise<HTMLElement>} */
async function fixtureComponent() {
  return fixture(html`
    <div>
      <lion-checkbox-group name="cb-group">
        <label slot="label">Pick</label>
        <lion-checkbox><label slot="label">A</label></lion-checkbox>
        <lion-checkbox><label slot="label">B</label></lion-checkbox>
      </lion-checkbox-group>
      <!-- Somewhere for the focus to go, so it does not leave the page. -->
      <button type="button">Next</button>
    </div>
  `);
}

/** @type {SrReader} */
let activeReader;

/**
 * Point the reader at the group and walk onto the first checkbox.
 *
 * VoiceOver follows OS focus and must not be walked (walking moves it off the control and it
 * then acts on whatever it is on). For the other readers the phrase log grows one phrase per
 * step, so walk until the checkbox itself is announced - the group is announced before its
 * children, and how many steps that takes depends on the markup around it.
 */
async function anchorOnGroup() {
  await sr.focus('lion-checkbox-group');
  if (activeReader !== 'voiceover') {
    for (let step = 0; step < 6; step += 1) {
      // eslint-disable-next-line no-await-in-loop
      const log = await sr.phraseLog();
      if (log.some(phrase => phrase.startsWith('checkbox,'))) {
        break;
      }
      // eslint-disable-next-line no-await-in-loop
      await sr.next();
    }
  }
}

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
    const wrapper = await fixtureComponent();
    const group = /** @type {HTMLElement} */ (wrapper.querySelector('lion-checkbox-group'));
    // axe, so the wiring stays pinned no matter how a reader phrases the announcement.
    await expect(
      group,
      // axe first, and with Lion's own exception: the overlay wrapper is a <dialog role="none"> for the
      // top layer, which axe reports as `aria-allowed-role`; Lion's overlay rationale prescribes ignoring
      // exactly that rule. See the package README.
    ).to.be.accessible({ ignoredRules: ['aria-allowed-role'] });

    await anchorOnGroup();

    // Neither real reader announced the group's own name in CI - they announce the control inside it -
    // so the group role stays pinned in the DOM; a user has to hear that these belong together.
    expect(group.getAttribute('role')).to.equal('group');

    await sr.expect({
      virtual: contains(
        'group, Pick, not disabled',
        'checkbox, A, not checked, not disabled, not invalid',
      ),
      nvda: containsLike('check box'),
      // VoiceOver says "tick box", not "checkbox": the earlier expectation asserted the word
      // from our own markup and would have passed on a reader that said something else. This
      // is the wording a VoiceOver user hears (reported by the reviewer of this test).
      voiceover: containsLike('tick box'),
    });

    // The group's own label is what makes the checkboxes a set, so the association is pinned
    // as well: the role alone does not carry the name.
    const labelId = group.getAttribute('aria-labelledby');
    expect(labelId, 'the group is labelled by its label node').to.not.equal(null);
    expect(group.querySelector(`#${labelId}`)?.textContent).to.equal('Pick');
  });

  it('announces a checkbox as ticked once it is checked', async () => {
    const wrapper = await fixtureComponent();
    const group = /** @type {CheckboxGroup} */ (wrapper.querySelector('lion-checkbox-group'));
    await group.updateComplete;
    // Tick the first box. It is set on the control rather than typed through the reader,
    // because the state to pin here is what a reader makes of it, not how it got there.
    group.formElements[0].checked = true;
    await group.updateComplete;

    await anchorOnGroup();

    await sr.expect({
      // The virtual reader cannot see this state: it resolves "checked" from the native
      // `checked` *attribute* (a plain `<input type=checkbox checked>` is announced as
      // "checked"), while Lion sets the IDL property. The real readers read the accessibility
      // tree, which follows the property, so the ticked state is asserted for them and the
      // name for the virtual reader.
      virtual: containsLike('checkbox, A'),
      nvda: containsLike('checked'),
      voiceover: containsLike('ticked'),
    });

    // Locally the state is pinned where it lives: on the native control.
    const input = /** @type {HTMLInputElement} */ (group.formElements[0].querySelector('input'));
    expect(input.checked, 'the native checkbox is checked').to.equal(true);
  });
});
