import { expect } from '@open-wc/testing';

import { IsIBAN, IsCountryIBAN, IsNotCountryIBAN } from '../src/validators.js';

import '../lion-input-iban.js';

describe('IBAN validation', () => {
  it('provides IsIBAN to check for valid IBAN', () => {
    const validator = new IsIBAN();
    expect(validator.execute('NL17INGB0002822608')).to.be.false;
    expect(validator.execute('DE89370400440532013000')).to.be.false;
  });

  it('provides IsCountryIBAN to limit IBANs from specific countries', () => {
    const nlValidator = new IsCountryIBAN('NL');
    const deValidator = new IsCountryIBAN('DE');
    expect(nlValidator.execute('NL17INGB0002822608')).to.be.false;
    expect(deValidator.execute('DE89370400440532013000')).to.be.false;
    expect(nlValidator.execute('DE89370400440532013000')).to.be.true;
    expect(nlValidator.execute('foo')).to.be.true;
  });

  it('provides IsNotCountryIBAN to prevent IBANs from specific countries', () => {
    const nlValidator = new IsNotCountryIBAN('NL');
    const deValidator = new IsNotCountryIBAN('DE');
    expect(nlValidator.execute('NL17INGB0002822608')).to.be.true;
    expect(deValidator.execute('DE89370400440532013000')).to.be.true;
    expect(nlValidator.execute('DE89370400440532013000')).to.be.false;
    expect(deValidator.execute('NL17INGB0002822608')).to.be.false;
    expect(nlValidator.execute('foo')).to.be.false;
  });
});
