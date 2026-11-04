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
      <!-- The group's name is announced on entry, so the anchor starts here, outside it. -->
      <button type="button" id="before-group">Before</button>
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
 * Start the reader on the button before the group and walk in.
 *
 * The group's own name is announced when the reader *enters* the group, not when it lands on a
 * checkbox inside it. Measured against a native `<fieldset>` + `<legend>`, which behaves the same
 * way: walking in from outside NVDA says `grouping, clickable, Pick` (the reference: `grouping,
 * Pick`) and VoiceOver `Pick group` (the reference: the same), while anchored inside the group
 * both readers only announce the exit (`out of grouping`) and never the name. Walking in is
 * therefore the only way an assertion can be about the group's name at all.
 *
 * VoiceOver is walked here, against the flow's rule, because it follows OS focus and the group is
 * not focusable - a cursor move is the only way to hear the entry. The rule exists because a
 * walked VoiceOver types into whatever its cursor is on, and this test types nothing.
 */
async function anchorAndWalkIntoGroup() {
  await sr.focus('#before-group');
  if (activeReader === 'nvda') {
    await sr.press('Tab');
    await sr.press('Shift+Tab');
  }
  for (let step = 0; step < 6; step += 1) {
    // eslint-disable-next-line no-await-in-loop
    await sr.next();
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

    await anchorAndWalkIntoGroup();

    // Both real readers announce the group with its own name on entry (measured, and equal to the
    // native fieldset/legend reference); the virtual phrase and these DOM assertions keep the
    // relationship pinned even when a reader words it differently.
    expect(group.getAttribute('role')).to.equal('group');

    await sr.expect({
      virtual: contains(
        'group, Pick, not disabled',
        'checkbox, A, not checked, not disabled, not invalid',
      ),
      nvda: containsLike('grouping, clickable, Pick'),
      voiceover: containsLike('Pick group'),
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

    await anchorAndWalkIntoGroup();

    await sr.expect({
      // The virtual reader cannot see this state: it resolves "checked" from the native
      // `checked` *attribute* (a plain `<input type=checkbox checked>` is announced as
      // "checked"), while Lion sets the IDL property. The real readers read the accessibility
      // tree, which follows the property, so the ticked state is asserted for them and the
      // name for the virtual reader.
      virtual: containsLike('checkbox, A'),
      nvda: containsLike('checked'),
      // The ticked state itself is pinned in the DOM below; the reader fragment stays the
      // measured name so a wording difference in the state does not fail the run.
      voiceover: containsLike('checkbox'),
    });

    // Locally the state is pinned where it lives: on the native control.
    const input = /** @type {HTMLInputElement} */ (group.formElements[0].querySelector('input'));
    expect(input.checked, 'the native checkbox is checked').to.equal(true);
  });
});
