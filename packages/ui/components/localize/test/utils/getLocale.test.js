import { expect } from '@open-wc/testing';
import { getLocale, getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';
import { localizeTearDown } from '@lion/ui/localize-test-helpers.js';

describe('getLocale', () => {
  afterEach(() => {
    localizeTearDown();
  });

  it('returns the given locale', () => {
    expect(getLocale('nl-NL')).to.equal('nl-NL');
  });

  it('falls back to the locale of the localize manager', () => {
    getLocalizeManager().locale = 'de-DE';
    expect(getLocale()).to.equal('de-DE');
  });
});
