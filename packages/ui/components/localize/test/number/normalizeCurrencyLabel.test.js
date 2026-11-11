import { expect } from '@open-wc/testing';
import { normalizeCurrencyLabel } from '@lion/ui/localize-no-side-effects.js';

describe('normalizeCurrencyLabel', () => {
  it('labels the Turkish lira "TL" for tr-TR', () => {
    expect(normalizeCurrencyLabel('TRY', 'tr-TR')).to.equal('TL');
  });

  it('keeps the currency code for other locales and currencies', () => {
    expect(normalizeCurrencyLabel('TRY', 'en-GB')).to.equal('TRY');
    expect(normalizeCurrencyLabel('EUR', 'tr-TR')).to.equal('EUR');
  });
});
