import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr, { contains } from '@lion/test-runner-screenreader/commands.js';
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
      <lion-input-iban>
        <label slot="label">IBAN</label>
      </lion-input-iban>
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

describe('<lion-input-iban> screen reader', () => {
  before(async () => {
    await sr.initialize();
  });

  after(async () => {
    await sr.stop();
  });

  beforeEach(async () => {
    await sr.reset();
  });

  it('announces an empty IBAN field', async () => {
    await fixtureIban();

    await sr.next();
    await sr.next();

    await sr.expect({
      virtual: contains('textbox, IBAN, not disabled, not invalid'),
      // nvda and voiceover wording is finalised by the first CI run of those readers
      nvda: contains('IBAN', 'edit'),
      voiceover: contains('IBAN', 'text field'),
    });
  });

  it('announces the formatted IBAN once the field is committed', async () => {
    await fixtureIban();

    await sr.next();
    await sr.next();
    await sr.type('NL17INGB0002822608');
    await sr.waitFor('NL17INGB0002822608');
    await sr.press('Tab');

    await sr.waitFor('NL17 INGB 0002 8226 08');

    await sr.expect({
      virtual: contains('textbox, IBAN, NL17 INGB 0002 8226 08, not disabled, not invalid'),
      nvda: contains('NL17 INGB 0002 8226 08'),
      voiceover: contains('NL17 INGB 0002 8226 08'),
    });
  });

  it('announces the invalid state once an invalid IBAN is committed', async () => {
    const el = await fixtureIban();

    await sr.next();
    await sr.next();
    await sr.type('FOO');
    await sr.waitFor('FOO');
    await sr.press('Tab');

    await sr.waitFor('Please enter a valid IBAN');

    await sr.expect({
      virtual: contains(
        'textbox, IBAN, FOO, not disabled, invalid',
        // "Error,," is what the reader joins: the additions phrase of the live
        // region plus its text phrase
        'assertive: Error,, Please enter a valid IBAN.',
      ),
      nvda: contains('FOO', 'invalid', 'Please enter a valid IBAN'),
      voiceover: contains('FOO', 'invalid', 'Please enter a valid IBAN'),
    });

    // The live region wiring itself is pinned in the DOM as well, so a broken
    // aria-live or a missing message fails here even before the readers disagree.
    const feedback = /** @type {HTMLElement} */ (el.querySelector('[slot="feedback"]'));
    await waitUntil(
      () => (feedback.shadowRoot?.textContent ?? '').includes('Please enter a valid IBAN'),
      'the validation feedback node renders its message',
    );
    expect(el.querySelector('input')?.getAttribute('aria-invalid')).to.equal('true');
    expect(feedback.getAttribute('aria-live')).to.equal('assertive');
    expect(feedback.shadowRoot?.textContent).to.include('Please enter a valid IBAN');
  });
});
