import { expect, fixture, aTimeout } from '@open-wc/testing';
import { html } from '@lion/core';
import { localize } from '@lion/localize';
import { localizeTearDown } from '@lion/localize/test-helpers.js';

import { formatAmount } from '../src/formatters.js';
import { parseAmount } from '../src/parsers.js';
import '../lion-input-amount.js';

describe('<lion-input-amount>', () => {
  beforeEach(() => {
    localizeTearDown();
  });

  it('uses formatAmount for formatting', async () => {
    const el = await fixture(`<lion-input-amount></lion-input-amount>`);
    expect(el.formatter).to.equal(formatAmount);
  });

  it('formatAmount uses currency provided on webcomponent', async () => {
    // JOD displays 3 fraction digits by default
    localize.locale = 'fr-FR';
    const el = await fixture(
      html`
        <lion-input-amount currency="JOD" .modelValue="${123}"></lion-input-amount>
      `,
    );
    expect(el.formattedValue).to.equal('123,000');
  });

  it('formatAmount uses locale provided in formatOptions', async () => {
    let el = await fixture(
      html`
        <lion-input-amount
          .formatOptions="${{ locale: 'en-GB' }}"
          .modelValue="${123}"
        ></lion-input-amount>
      `,
    );
    expect(el.formattedValue).to.equal('123.00');
    el = await fixture(
      html`
        <lion-input-amount
          .formatOptions="${{ locale: 'nl-NL' }}"
          .modelValue="${123}"
        ></lion-input-amount>
      `,
    );
    expect(el.formattedValue).to.equal('123,00');
  });

  it('ignores global locale change if property is provided', async () => {
    const el = await fixture(html`
      <lion-input-amount .modelValue=${123456.78} .locale="${'en-GB'}"></lion-input-amount>
    `);
    expect(el.formattedValue).to.equal('123,456.78'); // British
    localize.locale = 'nl-NL';
    await aTimeout();
    expect(el.formattedValue).to.equal('123,456.78'); // should stay British
  });

  it('uses parseAmount for parsing', async () => {
    const el = await fixture(`<lion-input-amount></lion-input-amount>`);
    expect(el.parser).to.equal(parseAmount);
  });

  it('sets inputmode attribute to decimal', async () => {
    const el = await fixture(`<lion-input-amount></lion-input-amount>`);
    expect(el._inputNode.inputMode).to.equal('decimal');
  });

  it('has type="text" to activate default keyboard on mobile with all necessary symbols', async () => {
    const el = await fixture(`<lion-input-amount></lion-input-amount>`);
    expect(el._inputNode.type).to.equal('text');
  });

  it('shows no currency by default', async () => {
    const el = await fixture(`<lion-input-amount></lion-input-amount>`);
    expect(Array.from(el.children).find(child => child.slot === 'after')).to.be.undefined;
  });

  it('displays currency if provided', async () => {
    const el = await fixture(`<lion-input-amount currency="EUR"></lion-input-amount>`);
    expect(Array.from(el.children).find(child => child.slot === 'after').innerText).to.equal('EUR');
  });

  it('displays correct currency for TRY if locale is tr-TR', async () => {
    localize.locale = 'tr-TR';
    const el = await fixture(`<lion-input-amount currency="TRY"></lion-input-amount>`);
    expect(Array.from(el.children).find(child => child.slot === 'after').innerText).to.equal('TL');
  });

  it('can update currency', async () => {
    const el = await fixture(`<lion-input-amount currency="EUR"></lion-input-amount>`);
    el.currency = 'USD';
    await el.updateComplete;
    expect(Array.from(el.children).find(child => child.slot === 'after').innerText).to.equal('USD');
  });

  it('ignores currency if a suffix is already present', async () => {
    const el = await fixture(
      `<lion-input-amount currency="EUR"><span slot="suffix">my-currency</span></lion-input-amount>`,
    );
    expect(Array.from(el.children).find(child => child.slot === 'suffix').innerText).to.equal(
      'my-currency',
    );
    el.currency = 'EUR';
    await el.updateComplete;
    expect(Array.from(el.children).find(child => child.slot === 'suffix').innerText).to.equal(
      'my-currency',
    );
  });

  describe('Accessibility', () => {
    it('adds currency id to aria-labelledby of input', async () => {
      const el = await fixture(`<lion-input-amount currency="EUR"></lion-input-amount>`);
      expect(el._currencyDisplayNode.getAttribute('data-label')).to.be.not.null;
      expect(el._inputNode.getAttribute('aria-labelledby')).to.contain(el._currencyDisplayNode.id);
    });

    it('adds an aria-label to currency slot', async () => {
      const el = await fixture(`<lion-input-amount currency="EUR"></lion-input-amount>`);
      expect(el._currencyDisplayNode.getAttribute('aria-label')).to.equal('euros');
      el.currency = 'USD';
      await el.updateComplete;
      expect(el._currencyDisplayNode.getAttribute('aria-label')).to.equal('US dollars');
      el.currency = 'PHP';
      await el.updateComplete;
      expect(el._currencyDisplayNode.getAttribute('aria-label')).to.equal('Philippine pisos');
    });
  });

  it('is accessible', async () => {
    const el = await fixture(
      `<lion-input-amount><label slot="label">Label</label></lion-input-amount>`,
    );
    await expect(el).to.be.accessible();
  });

  it('is accessible when readonly', async () => {
    const el = await fixture(
      `<lion-input-amount readonly .modelValue=${'123'}><label slot="label">Label</label></lion-input-amount>`,
    );
    await expect(el).to.be.accessible();
  });

  it('is accessible when disabled', async () => {
    const el = await fixture(
      `<lion-input-amount disabled><label slot="label">Label</label></lion-input-amount>`,
    );
    await expect(el).to.be.accessible();
  });
});
