import { expect } from '@open-wc/testing';
import { smokeTestValidator } from '@lion/validate/test/validators.test.js';

import {
  isIBAN,
  isIBANValidator,
  isCountryIBAN,
  isCountryIBANValidator,
} from '../src/validators.js';

describe('IBAN validation', () => {
  it('provides isIBAN() to check for valid IBAN', () => {
    expect(isIBAN('NL17INGB0002822608')).to.be.true;
    expect(isIBAN('DE89370400440532013000')).to.be.true;
    smokeTestValidator('isIBAN', isIBANValidator, 'NL17INGB0002822608');
  });
  it('provides isCountryIBAN() to limit IBANs from specfic countries', () => {
    expect(isCountryIBAN('NL17INGB0002822608', 'NL')).to.be.true;
    expect(isCountryIBAN('DE89370400440532013000', 'DE')).to.be.true;
    expect(isCountryIBAN('DE89370400440532013000', 'NL')).to.be.false;
    expect(isCountryIBAN('foo', 'NL')).to.be.false;
    smokeTestValidator('isCountryIBAN', isCountryIBANValidator, 'NL17INGB0002822608', 'NL');
  });
});
