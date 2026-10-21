import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr, { contains, containsLike } from '@lion/test-runner-screenreader/commands.js';
import '@lion/ui/define/lion-input-iban.js';

/**
 * Screen reader tests for <lion-input-iban>.
 *
 * Input goes through the screen reader (sr.type/sr.press/sr.next), because NVDA
 * and VoiceOver only speak what their own keyboard input produced. Every
 * expectation describes all three readers: `virtual` is what runs locally,
 * `nvda` and `voiceover` are the blocking runs in CI.
 *
 * `<lion-input-iban>` formats on the `change` event (`FormatMixin.formatOn`), so
 * the formatted value and the invalid state are only part of what a user hears
 * after the field is committed - by design, so a user is not nagged halfway
 * through typing an IBAN. Hence the Tab between typing and asserting.
 *
 * The error message itself sits in the shadow root of `lion-validation-feedback`
 * with `aria-live="assertive"`, so every reader announces it. The virtual reader
 * needs patches/@guidepup+virtual-screen-reader+0.33.0.patch for that: upstream
 * only observes the light DOM and only walks up through `parentElement`, so a
 * live region inside a shadow root stays invisible to it. The DOM assertions at
 * the end of the invalid case keep the live region wiring covered as well.
 *
 * @typedef {import('@lion/ui/input-iban.js').LionInputIban} LionInputIban
 */

/**
 * @returns {Promise<LionInputIban>}
 */
async function fixtureIban() {
  const el = /** @type {LionInputIban} */ (
    await fixture(html`
      <div>
        <lion-input-iban>
          <label slot="label">IBAN</label>
        </lion-input-iban>
        <!-- Somewhere for Tab to go: without a focusable neighbour the focus leaves
             the page (the reader then describes the browser chrome) and the field
             never gets its blur-and-come-back. -->
        <button type="button">Next</button>
      </div>
    `)
  );
  return el;
}

/**
 * Wait until a DOM condition holds, so a DOM assertion does not race the render
 * (the error message is rendered a tick after `aria-invalid` flips).
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

/** @type {import('@lion/test-runner-screenreader').SrReader} */
let activeReader;

/**
 * Point the reader at the IBAN field. A real reader follows OS focus; the virtual
 * reader has its own cursor, so it also walks to the field. Walking with a real reader
 * would move it off the field again (VoiceOver then types into whatever it is on, not
 * into the field).
 */
async function anchorOnIbanField() {
  await sr.focus('lion-input-iban');
  if (activeReader === 'virtual') {
    await sr.next();
    await sr.next();
  }
}

describe('<lion-input-iban> screen reader', () => {
  before(async () => {
    activeReader = await sr.initialize();
  });

  after(async () => {
    await sr.stop();
  });

  beforeEach(async () => {
    await sr.reset();
  });

  it('announces an empty IBAN field', async () => {
    await fixtureIban();

    await anchorOnIbanField();

    await sr.expect({
      virtual: contains('textbox, IBAN, not disabled, not invalid'),
      // nvda speaks what the focus landed on; for an empty text field its log
      // holds the value phrase "blank" (its typed-character echo below shows it
      // does follow the keyboard, so nothing has to steer it there)
      nvda: contains('blank'),
      voiceover: contains('IBAN edit text'),
    });
  });

  it('announces the formatted IBAN once the field is committed', async () => {
    const el = await fixtureIban();

    await anchorOnIbanField();
    await sr.type('NL17INGB0002822608');
    // Wait in the DOM, not in the reader's log: nvda echoes every character it
    // types, so the value is never one phrase while typing.
    await waitUntil(
      () => (el.querySelector('input')?.value ?? '') !== '',
      'the typed value lands in the field',
    );
    // Tab commits the value (FormatMixin commits on change) and moves to the button
    // next to the field, so the focus stays in the page instead of leaving it for the
    // browser chrome. Coming back to the field makes every reader announce it again,
    // with its new value: a real reader follows the focus, the virtual reader walks.
    await sr.press('Tab');
    await sr.press('Shift+Tab');
    await anchorOnIbanField();

    // The value as both real readers say it ("NL 17 INGB ..."; the DOM formatting has
    // no space after the country code), so the wait cannot be about the exact string.
    await sr.waitFor('INGB 0002 8226 08');

    await sr.expect({
      virtual: contains('textbox, IBAN, NL17 INGB 0002 8226 08, not disabled, not invalid'),
      // One phrase for the whole field: name, role, value
      nvda: containsLike('IBAN, edit, selected NL 17 INGB 0002 8226 08'),
      voiceover: containsLike('INGB 0002 8226 08'),
    });
  });

  it('announces the invalid state once an invalid IBAN is committed', async () => {
    const el = await fixtureIban();

    await anchorOnIbanField();
    await sr.type('FOO');
    await waitUntil(
      () => (el.querySelector('input')?.value ?? '') !== '',
      'the typed value lands in the field',
    );
    await sr.press('Tab');
    await sr.press('Shift+Tab');
    await anchorOnIbanField();

    await sr.waitFor('Please enter a valid IBAN');

    await sr.expect({
      virtual: contains('textbox, IBAN, FOO, not disabled, invalid'),
      // nvda says the state and the message in the field phrase: "IBAN, edit, invalid
      // entry, Error, Please enter a valid IBAN., selected FOO"
      nvda: containsLike('invalid entry, Error, Please enter a valid IBAN.'),
      voiceover: containsLike('invalid'),
    });

    // The message itself. Readers decorate a live region announcement with its
    // politeness and join the additions phrase to the text ("polite: Error,,
    // Please enter a valid IBAN."), and that decoration is not what a user hears,
    // so the message is asserted as part of a spoken phrase.
    await sr.expect({
      virtual: containsLike('Please enter a valid IBAN'),
      nvda: containsLike('Please enter a valid IBAN'),
      voiceover: containsLike('Please enter a valid IBAN'),
    });

    // The live region wiring itself is pinned in the DOM as well, so a broken
    // aria-live or a missing message fails here even before the readers disagree.
    const feedback = /** @type {HTMLElement} */ (el.querySelector('[slot="feedback"]'));
    await waitUntil(
      () => (feedback.shadowRoot?.textContent ?? '').includes('Please enter a valid IBAN'),
      'the validation feedback node renders its message',
    );
    expect(el.querySelector('input')?.getAttribute('aria-invalid')).to.equal('true');
    // Lion announces the first error assertively and repeats the same message
    // politely; the test re-focuses the field to bring a real reader back into the
    // page after Tab left it, which is that repeat. Both are live regions.
    expect(feedback.getAttribute('aria-live')).to.be.oneOf(['assertive', 'polite']);
    expect(feedback.shadowRoot?.textContent).to.include('Please enter a valid IBAN');
  });
});
