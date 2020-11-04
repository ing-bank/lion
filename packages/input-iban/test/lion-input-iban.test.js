import { expect, fixture as _fixture } from '@open-wc/testing';
import { html } from '@lion/core';

import { IsCountryIBAN } from '../src/validators.js';
import { formatIBAN } from '../src/formatters.js';
import { parseIBAN } from '../src/parsers.js';

import '../lion-input-iban.js';

/**
 * @typedef {import('../src/LionInputIban').LionInputIban} LionInputIban
 * @typedef {import('lit-html').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult|string) => Promise<LionInputIban>} */ (_fixture);

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
    expect(el._inputNode.type).to.equal('text');
  });

  it('has validator "IsIBAN" applied by default', async () => {
    const el = await fixture(`<lion-input-iban></lion-input-iban>`);
    el.modelValue = 'FOO';
    expect(el.hasFeedbackFor).to.include('error');
    expect(el.validationStates).to.have.property('error');
    expect(el.validationStates.error).to.have.property('IsIBAN');
    el.modelValue = 'DE89370400440532013000';
    expect(el.hasFeedbackFor).not.to.include('error');
    expect(el.validationStates).to.have.property('error');
    expect(el.validationStates.error).not.to.have.property('IsIBAN');
  });

  it('can apply validator "IsCountryIBAN" to restrict countries', async () => {
    const el = await fixture(html`
      <lion-input-iban .validators=${[new IsCountryIBAN('NL')]}> </lion-input-iban>
    `);
    el.modelValue = 'DE89370400440532013000';
    expect(el.hasFeedbackFor).to.include('error');
    expect(el.validationStates).to.have.property('error');
    expect(el.validationStates.error).to.have.property('IsCountryIBAN');
    el.modelValue = 'NL17INGB0002822608';
    expect(el.hasFeedbackFor).not.to.include('error');
    expect(el.validationStates).to.have.property('error');
    expect(el.validationStates.error).not.to.have.property('IsCountryIBAN');
    el.modelValue = 'FOO';
    expect(el.hasFeedbackFor).to.include('error');
    expect(el.validationStates).to.have.property('error');
    expect(el.validationStates.error).to.have.property('IsIBAN');
    expect(el.validationStates.error).to.have.property('IsCountryIBAN');
  });

  it('is accessible', async () => {
    const el = await fixture(
      `<lion-input-iban><label slot="label">Label</label></lion-input-iban>`,
    );
    await expect(el).to.be.accessible();
  });

  it('is accessible when readonly', async () => {
    const el = await fixture(
      `<lion-input-iban readonly><label slot="label">Label</label></lion-input-iban>`,
    );
    await expect(el).to.be.accessible();
  });

  it('is accessible when disabled', async () => {
    const el = await fixture(
      `<lion-input-iban disabled><label slot="label">Label</label></lion-input-iban>`,
    );
    await expect(el).to.be.accessible();
  });
});
