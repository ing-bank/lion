import { expect, fixture } from '@open-wc/testing';
import { html } from '@lion/core';

import { IsCountryIBAN } from '../src/validators.js';
import { formatIBAN } from '../src/formatters.js';
import { parseIBAN } from '../src/parsers.js';

import '../lion-input-iban.js';

describe('<lion-input-iban>', () => {
  it('uses formatIBAN for formatting', async () => {
    const el = await fixture(`<lion-input-iban></lion-input-iban>`);
    expect(el.formatter).to.equal(formatIBAN);
  });

  it('uses parseIBAN for parsing', async () => {
    const el = await fixture(`<lion-input-iban></lion-input-iban>`);
    expect(el.parser).to.equal(parseIBAN);
  });

  it('has a type = text', async () => {
    const el = await fixture(`<lion-input-iban></lion-input-iban>`);
    expect(el.inputElement.type).to.equal('text');
  });

  it('has validator "IsIBAN" applied by default', async () => {
    const el = await fixture(`<lion-input-iban></lion-input-iban>`);
    el.modelValue = 'FOO';
    expect(el.errorStates.IsIBAN).to.be.true;
    el.modelValue = 'DE89370400440532013000';
    expect(el.errorStates.IsIBAN).to.be.undefined;
  });

  it('can apply validator "IsCountryIBAN" to restrict countries', async () => {
    const el = await fixture(html`
      <lion-input-iban .validators=${[new IsCountryIBAN('NL')]}> </lion-input-iban>
    `);
    el.modelValue = 'DE89370400440532013000';
    expect(el.errorStates.IsCountryIBAN).to.be.true;
    expect(el.errorStates.IsIBAN).to.be.undefined;
    el.modelValue = 'NL17INGB0002822608';
    expect(el.errorStates.IsCountryIBAN).to.be.undefined;
    expect(el.errorStates.IsIBAN).to.be.undefined;
    el.modelValue = 'FOO';
    expect(el.errorStates.IsIBAN).to.be.true;
  });
});
