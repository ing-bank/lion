import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import { Required } from '@lion/ui/form-core.js';
import sr, { contains, containsLike, once } from 'test-runner-sr/commands.js';
import '@lion/ui/define/lion-input.js';

/**
 * Screen reader tests for <lion-input>.
 *
 * The base control every other input builds on: a wrong label, role or description here is
 * heard in fifteen components. So the suite covers the whole spoken surface of the control -
 * label, help text, prefix, suffix, the value once it is committed, the read-only state and
 * the required state - and not just the empty field.
 *
 * The validation *message* is not covered here: it belongs to the validators, and
 * `<lion-input-iban>`'s screen reader test pins the assertive live region and its wording
 * (the base control's own state machine is pinned in `FormControlMixin.test.js`).
 *
 * `virtual` is what runs locally, NVDA and VoiceOver are the blocking CI runs; every
 * expectation describes all three (the type is a Record, so a missing reader is a type error).
 *
 * @typedef {import('@lion/ui/input.js').LionInput} Input
 * @typedef {import('test-runner-sr').SrReader} SrReader
 */

/**
 * @param {import('lit').TemplateResult} [extra] slots rendered inside the field
 * @returns {Promise<HTMLElement>}
 */
async function fixtureComponent(extra) {
  return fixture(html`
    <div>
      <lion-input><label slot="label">Name</label>${extra}</lion-input>
      <!-- Somewhere for Tab to go: without a focusable neighbour the focus leaves the page
           (the reader then describes the browser chrome) and the field never comes back. -->
      <button type="button">Next</button>
    </div>
  `);
}

/** @param {HTMLElement} wrapper */
const fieldOf = wrapper => /** @type {Input} */ (wrapper.querySelector('lion-input'));

/** @type {SrReader} */
let activeReader;

/**
 * Point the reader at the field.
 *
 * The virtual reader has its own cursor, and NVDA says nothing about a field its focus merely
 * landed on, so both are walked onto the control. VoiceOver must not be walked: it follows OS
 * focus, and walking moves it off the field (in CI it then typed into the button next to it).
 *
 * NVDA additionally gets a Tab/Shift+Tab walk first, which is what makes it announce the field
 * it is on - the same fix that unblocked the accordion, tooltip and select-rich tests.
 */
async function anchorOnField() {
  await sr.focus('lion-input');
  if (activeReader === 'nvda') {
    await sr.press('Tab');
    await sr.press('Shift+Tab');
  }
  if (activeReader !== 'voiceover') {
    // Walk onto the field: the phrase log grows one phrase per step, and how many steps it
    // takes depends on how many nodes (label, help text, prefix, suffix) sit around the field.
    // Stop as soon as the control itself is announced - walking past it would leave a real
    // reader's cursor somewhere that cannot be typed into.
    for (let step = 0; step < 10; step += 1) {
      // eslint-disable-next-line no-await-in-loop
      const log = await sr.phraseLog();
      if (log.some(phrase => /textbox|edit/.test(phrase))) {
        break;
      }
      // eslint-disable-next-line no-await-in-loop
      await sr.next();
    }
  }
}

/**
 * Wait until a DOM condition holds, so a DOM assertion does not race the render.
 *
 * @param {() => boolean} condition
 * @param {string} description
 * @param {number} [timeout]
 */
async function waitUntil(condition, description, timeout = 5000) {
  const deadline = Date.now() + timeout;
  while (!condition()) {
    if (Date.now() > deadline) {
      throw new Error(`Timed out after ${timeout}ms waiting until ${description}`);
    }
    // eslint-disable-next-line no-await-in-loop
    await new Promise(resolve => {
      setTimeout(resolve, 50);
    });
  }
}

describe('<lion-input> screen reader', () => {
  before(async () => {
    activeReader = await sr.initialize();
  });

  after(async () => {
    await sr.stop();
  });

  beforeEach(async () => {
    await sr.reset();
  });

  it('announces the field with its label', async () => {
    const wrapper = await fixtureComponent();
    const field = fieldOf(wrapper);
    // The wiring itself, independent of how a reader phrases it: axe fails the run when a
    // label, role or state stops being exposed (a reader that words things differently is not
    // a regression, a control that lost its name is).
    // axe runs first, and with Lion's own exception: the overlay wrapper is a <dialog
    // role="none"> for the top layer, which axe reports as `aria-allowed-role`; Lion's overlay
    // rationale prescribes ignoring exactly that rule. See the package README.
    await expect(field).to.be.accessible({ ignoredRules: ['aria-allowed-role'] });

    await anchorOnField();

    await sr.expect({
      virtual: contains('textbox, Name, not disabled, not invalid'),
      // NVDA says nothing about a field its cursor merely landed on; anchored with the
      // Tab/Shift+Tab walk above it announces the field it is on, i.e. the label and the role.
      // (This is why the first version of this test asserted the value phrase "blank" - a
      // cursor that never announced the label could only be checked on the value.)
      nvda: containsLike('Name'),
      // VoiceOver follows OS focus and announces the field as "<label> edit text" in one phrase.
      voiceover: containsLike('Name', 'edit text'),
    });

    // The label is not only spoken, it is also the field's accessible name: pinned in the DOM
    // so a broken label association fails here even when a reader happens to guess.
    expect(field.querySelector('input')?.labels?.length ?? 0).to.be.greaterThan(0);
  });

  it('announces the help text as the description of the field', async () => {
    const wrapper = await fixtureComponent(html`<div slot="help-text">Your full name</div>`);
    const field = fieldOf(wrapper);
    await expect(field).to.be.accessible({ ignoredRules: ['aria-allowed-role'] });

    await anchorOnField();

    await sr.expect({
      virtual: contains('textbox, Name, Your full name, not disabled, not invalid'),
      nvda: containsLike('Your full name'),
      voiceover: containsLike('Your full name'),
    });

    // The help text reaches a reader as the field's description, so the association is pinned:
    // a reader that announces it must be reading the described-by node.
    const input = /** @type {HTMLInputElement} */ (field.querySelector('input'));
    const helpText = /** @type {HTMLElement} */ (field.querySelector('[slot="help-text"]'));
    expect(helpText.id, 'the help text node carries an id').to.not.equal('');
    expect(
      input.getAttribute('aria-describedby') ?? '',
      'the field describes itself by its help text',
    ).to.include(helpText.id);
    expect(helpText.textContent).to.include('Your full name');
  });

  it('announces the prefix and the suffix', async () => {
    const wrapper = await fixtureComponent(html`
      <span slot="prefix">Mr.</span>
      <span slot="suffix">jr.</span>
    `);
    const field = fieldOf(wrapper);
    await expect(field).to.be.accessible({ ignoredRules: ['aria-allowed-role'] });

    await anchorOnField();

    await sr.expect({
      virtual: contains('Mr.', 'jr.', 'textbox, Name, not disabled, not invalid'),
      nvda: containsLike('Mr.'),
      voiceover: containsLike('Mr.'),
    });

    // Whatever a reader does with them, the decorations are part of the field's own DOM.
    expect(wrapper.querySelector('[slot="prefix"]')?.textContent).to.equal('Mr.');
    expect(wrapper.querySelector('[slot="suffix"]')?.textContent).to.equal('jr.');
  });

  it('announces the value once it is typed and committed', async () => {
    const wrapper = await fixtureComponent();
    const field = fieldOf(wrapper);

    await anchorOnField();
    await sr.type('Ada');
    // Wait in the DOM, not in the reader's log: NVDA and VoiceOver echo every character they
    // type, so the value is never one phrase while typing.
    await waitUntil(
      () => (field.querySelector('input')?.value ?? '') !== '',
      'the typed value lands in the field',
    );
    // Tab commits the value (FormatMixin commits on change) and moves to the button next to the
    // field, so the focus stays in the page; coming back makes every reader announce the field
    // again, with its new value.
    await sr.press('Tab');
    await sr.press('Shift+Tab');
    await anchorOnField();

    await sr.expect({
      virtual: contains('textbox, Name, Ada, not disabled, not invalid'),
      nvda: containsLike('Ada'),
      voiceover: containsLike('Ada'),
    });

    // The value is the text a reader is most likely to say twice - once from the field it is
    // on and once from a live region - and a `contains` passes just as happily either way. So
    // the count is asserted as well: the committed value has to be spoken in exactly one
    // utterance. (This is what `once` exists for.)
    await sr.expect({
      virtual: once('Ada'),
      nvda: once('Ada'),
      voiceover: once('Ada'),
    });
  });

  it('announces the read-only state of a field it cannot edit', async () => {
    const wrapper = await fixtureComponent();
    const field = fieldOf(wrapper);
    field.readOnly = true;
    field.modelValue = 'Ada Lovelace';
    await field.updateComplete;
    await expect(field).to.be.accessible({ ignoredRules: ['aria-allowed-role'] });

    await anchorOnField();

    await sr.expect({
      virtual: contains('textbox, Name, Ada Lovelace, not disabled, not invalid, read only'),
      // Both real readers announce the value of a read-only field; the wording of the state
      // itself differs per reader and per version, so it stays with the virtual phrase.
      nvda: containsLike('Ada Lovelace'),
      voiceover: containsLike('Ada Lovelace'),
    });

    // The state a reader reports comes from the native control, so pin it there.
    expect(/** @type {HTMLInputElement} */ (field.querySelector('input')).readOnly).to.equal(true);
  });

  it('announces a required field as required', async () => {
    const wrapper = await fixture(html`
      <div>
        <lion-input .validators=${[new Required()]}><label slot="label">Name</label></lion-input>
        <!-- Somewhere for Tab to go, so the focus does not leave the page. -->
        <button type="button">Next</button>
      </div>
    `);
    const field = fieldOf(wrapper);
    await field.updateComplete;
    await expect(field).to.be.accessible({ ignoredRules: ['aria-allowed-role'] });

    await anchorOnField();

    // "required" is a state of the field the user has to hear before filling it in - the field
    // is empty and not invalid at this point, so nothing else in the phrase says why it matters.
    await sr.expect({
      virtual: contains('textbox, Name, not disabled, not invalid, required'),
      nvda: containsLike('required'),
      voiceover: containsLike('required'),
    });

    expect(field.querySelector('input')?.getAttribute('aria-required')).to.equal('true');
  });
});
