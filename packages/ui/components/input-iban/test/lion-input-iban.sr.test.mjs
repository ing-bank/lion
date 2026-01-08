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
 * with `aria-live="assertive"` (DOM verified), so the real readers announce it.
 * The virtual screen reader does not model live regions and only reports the
 * field as "invalid", which is why only nvda and voiceover expect the message.
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
      virtual: contains('textbox, IBAN, not invalid, not disabled'),
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
      virtual: contains('textbox, IBAN, NL17 INGB 0002 8226 08, not invalid, not disabled'),
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

    await sr.waitFor('FOO, invalid');

    await sr.expect({
      virtual: contains('textbox, IBAN, FOO, invalid, not disabled'),
      nvda: contains('FOO', 'invalid', 'Please enter a valid IBAN'),
      voiceover: contains('FOO', 'invalid', 'Please enter a valid IBAN'),
    });

    // The virtual reader does not model live regions, so the message the real
    // readers announce is pinned down in the DOM instead.
    const feedback = /** @type {HTMLElement} */ (el.querySelector('[slot="feedback"]'));
    expect(el.querySelector('input')?.getAttribute('aria-invalid')).to.equal('true');
    expect(feedback.getAttribute('aria-live')).to.equal('assertive');
    expect(feedback.shadowRoot?.textContent).to.include('Please enter a valid IBAN');
  });
});
