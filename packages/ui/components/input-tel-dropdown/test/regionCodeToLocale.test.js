import { expect } from '@open-wc/testing';
import { regionCodeToLocale } from '../src/regionCodeToLocale.js';

describe('regionCodeToLocale', () => {
  it('returns the most likely locale basename for a region', () => {
    expect(regionCodeToLocale('NL')).to.equal('nl-Latn-NL');
    expect(regionCodeToLocale('FR')).to.equal('fr-Latn-FR');
    expect(regionCodeToLocale('DE')).to.equal('de-Latn-DE');
  });
});
