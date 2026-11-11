import { expect } from '@open-wc/testing';
import { Unparseable } from '@lion/ui/form-core.js';
import { getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';
import { localizeTearDown } from '@lion/ui/localize-test-helpers.js';

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

  it('marks an invalid IBAN as invalid for IsNotCountryIBAN, whatever its country', () => {
    expect(IsNotCountryIBAN.validatorName).to.equal('IsNotCountryIBAN');
    expect(new IsNotCountryIBAN('NL').execute('DE89370400440532013001')).to.be.true;
    expect(new IsNotCountryIBAN(['NL', 'FR']).execute('foo')).to.be.true;
  });

  describe('messages', () => {
    // The translations are loaded once per page (on first use), so no tear down between tests
    before(() => {
      getLocalizeManager().locale = 'en-GB';
    });

    after(() => {
      localizeTearDown();
    });

    it('provides a message for IsIBAN', async () => {
      expect(await IsIBAN.getMessage({ fieldName: 'IBAN' })).to.equal('Please enter a valid IBAN.');
    });

    it('names the required country in the IsCountryIBAN message', async () => {
      expect(
        await IsCountryIBAN.getMessage({
          fieldName: 'IBAN',
          params: 'NL',
          modelValue: 'DE89370400440532013000',
        }),
      ).to.equal('Please enter a valid Dutch IBAN.');
      expect(
        await IsCountryIBAN.getMessage({ fieldName: 'IBAN', params: 'XX', modelValue: 'DE89' }),
      ).to.equal('Please enter a valid XX IBAN.');
    });

    it('gives the IsIBAN message for IsCountryIBAN when the value is unparseable', async () => {
      expect(
        await IsCountryIBAN.getMessage({
          fieldName: 'IBAN',
          params: 'NL',
          modelValue: new Unparseable('foo'),
        }),
      ).to.equal('Please enter a valid IBAN.');
    });

    it('names the country of the entered IBAN in the IsNotCountryIBAN message', async () => {
      expect(
        await IsNotCountryIBAN.getMessage({
          fieldName: 'IBAN',
          params: 'NL',
          modelValue: 'NL17INGB0002822608',
        }),
      ).to.equal('Dutch IBAN is not allowed.');
      expect(
        await IsNotCountryIBAN.getMessage({
          fieldName: 'IBAN',
          params: 'XX',
          modelValue: 'XX17INGB0002822608',
        }),
      ).to.equal('XX IBAN is not allowed.');
    });

    it('gives the IsIBAN message for IsNotCountryIBAN when the value is unparseable', async () => {
      expect(
        await IsNotCountryIBAN.getMessage({
          fieldName: 'IBAN',
          params: 'NL',
          modelValue: new Unparseable('foo'),
        }),
      ).to.equal('Please enter a valid IBAN.');
    });
  });
});
