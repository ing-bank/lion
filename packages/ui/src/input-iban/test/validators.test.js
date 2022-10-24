import { expect } from '@open-wc/testing';

import { IsIBAN, IsCountryIBAN, IsNotCountryIBAN } from '@lion/ui/input-iban.js';

import '@lion/ui/define/lion-input-iban.js';

describe('IBAN validation', () => {
  it('provides IsIBAN to check for valid IBAN', () => {
    const validator = new IsIBAN();
    expect(validator.execute('NL17INGB0002822608')).to.be.false;
    expect(validator.execute('DE89370400440532013000')).to.be.false;
    expect(validator.execute('foo')).to.be.true;
  });

  it('provides IsCountryIBAN to limit IBANs from specific countries', () => {
    const nlValidator = new IsCountryIBAN('NL');
    const deValidator = new IsCountryIBAN('DE');
    expect(nlValidator.execute('NL17INGB0002822608')).to.be.false;
    expect(deValidator.execute('DE89370400440532013000')).to.be.false;
    expect(nlValidator.execute('DE89370400440532013000')).to.be.true;
    expect(deValidator.execute('NL17INGB0002822608')).to.be.true;
  });

  it('accepts an array for IsCountryIBAN to enforce IBANs from multiple countries', () => {
    const nlValidator = new IsCountryIBAN(['NL', 'FR']);
    const deValidator = new IsCountryIBAN(['DE', 'SK']);
    expect(nlValidator.execute('NL17INGB0002822608')).to.be.false;
    expect(nlValidator.execute('FR1420041010050500013M02606')).to.be.false;
    expect(nlValidator.execute('DE89370400440532013000')).to.be.true;
    expect(nlValidator.execute('SK3112000000198742637541')).to.be.true;

    expect(deValidator.execute('NL17INGB0002822608')).to.be.true;
    expect(deValidator.execute('FR1420041010050500013M02606')).to.be.true;
    expect(deValidator.execute('DE89370400440532013000')).to.be.false;
    expect(deValidator.execute('SK3112000000198742637541')).to.be.false;
  });

  it('provides IsNotCountryIBAN to prevent IBANs from specific countries', () => {
    const nlValidator = new IsNotCountryIBAN('NL');
    const deValidator = new IsNotCountryIBAN('DE');
    expect(nlValidator.execute('NL17INGB0002822608')).to.be.true;
    expect(deValidator.execute('DE89370400440532013000')).to.be.true;
    expect(nlValidator.execute('DE89370400440532013000')).to.be.false;
    expect(deValidator.execute('NL17INGB0002822608')).to.be.false;
  });

  it('accepts an array for IsNotCountryIBAN to prevent IBANs from multiple countries', () => {
    const nlValidator = new IsNotCountryIBAN(['NL', 'FR']);
    const deValidator = new IsNotCountryIBAN(['DE', 'SK']);
    expect(nlValidator.execute('NL17INGB0002822608')).to.be.true;
    expect(nlValidator.execute('FR1420041010050500013M02606')).to.be.true;
    expect(nlValidator.execute('DE89370400440532013000')).to.be.false;
    expect(nlValidator.execute('SK3112000000198742637541')).to.be.false;

    expect(deValidator.execute('NL17INGB0002822608')).to.be.false;
    expect(deValidator.execute('FR1420041010050500013M02606')).to.be.false;
    expect(deValidator.execute('DE89370400440532013000')).to.be.true;
    expect(deValidator.execute('SK3112000000198742637541')).to.be.true;
  });

  it('allows providing lower cased country isos', () => {
    const nlValidator = new IsCountryIBAN('nl');
    expect(nlValidator.execute('NL17INGB0002822608')).to.be.false;
    expect(nlValidator.execute('DE89370400440532013000')).to.be.true;

    const deValidator = new IsNotCountryIBAN('de');
    expect(deValidator.execute('DE89370400440532013000')).to.be.true;
    expect(deValidator.execute('NL17INGB0002822608')).to.be.false;

    const deskValidator = new IsNotCountryIBAN(['de', 'sk']);
    expect(deskValidator.execute('NL17INGB0002822608')).to.be.false;
    expect(deskValidator.execute('FR1420041010050500013M02606')).to.be.false;
    expect(deskValidator.execute('DE89370400440532013000')).to.be.true;
    expect(deskValidator.execute('SK3112000000198742637541')).to.be.true;
  });
});
