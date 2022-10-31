import { expect } from '@open-wc/testing';
import { getCurrencyName } from '@lion/ui/localize.js';
import { localizeTearDown } from '@lion/ui/localize-test-helpers.js';

describe('getCurrencyName', () => {
  afterEach(localizeTearDown);

  it('returns the right name for currency and locale combination', async () => {
    expect(getCurrencyName('USD', { locale: 'en-GB' })).to.equal('US dollars');
    expect(getCurrencyName('USD', { locale: 'nl-NL' })).to.equal('Amerikaanse dollar');
    expect(getCurrencyName('EUR', { locale: 'en-GB' })).to.equal('euros');
    expect(getCurrencyName('EUR', { locale: 'nl-NL' })).to.equal('euro');
  });
});
