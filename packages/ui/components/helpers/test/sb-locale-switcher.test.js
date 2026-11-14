import { expect, fixture, html } from '@open-wc/testing';
import '@lion/ui/define-helpers/sb-locale-switcher.js';

/**
 * @typedef {import('@lion/ui/helpers.js').SbLocaleSwitcher} SbLocaleSwitcher
 */

describe('sb-locale-switcher', () => {
  const originalLang = document.documentElement.lang;

  afterEach(() => {
    document.documentElement.lang = originalLang;
  });

  /** @param {SbLocaleSwitcher} el */
  const buttons = el =>
    Array.from(/** @type {ShadowRoot} */ (el.shadowRoot).querySelectorAll('button'));

  it('renders a button per default locale', async () => {
    const el = /** @type {SbLocaleSwitcher} */ (
      await fixture(html`<sb-locale-switcher></sb-locale-switcher>`)
    );
    expect(buttons(el).map(b => b.textContent)).to.deep.equal([
      'en-GB',
      'en-US',
      'en-AU',
      'nl-NL',
      'nl-BE',
    ]);
  });

  it('renders the locales of the show-locales attribute', async () => {
    const el = /** @type {SbLocaleSwitcher} */ (
      await fixture(
        html`<sb-locale-switcher show-locales='["de-DE","fr-FR"]'></sb-locale-switcher>`,
      )
    );
    expect(buttons(el).map(b => b.textContent)).to.deep.equal(['de-DE', 'fr-FR']);
  });

  it('sets the clicked locale on <html lang>', async () => {
    const el = /** @type {SbLocaleSwitcher} */ (
      await fixture(html`<sb-locale-switcher></sb-locale-switcher>`)
    );
    buttons(el)[3].click();
    expect(document.documentElement.lang).to.equal('nl-NL');
  });
});
