import { html } from '@lion/core';
import { localize } from '@lion/localize';
import { localizeTearDown } from '@lion/localize/test-helpers';
import { aTimeout, expect, fixture } from '@open-wc/testing';
import { getInputMembers } from '@lion/input/test-helpers';
import '@lion/input-amount/define';
import { formatAmount } from '../src/formatters.js';
import { parseAmount } from '../src/parsers.js';

/**
 * @typedef {import('@lion/input/src/LionInput').LionInput} LionInput
 * @typedef {import('../src/LionInputAmount').LionInputAmount} LionInputAmount
 */

describe('<lion-input-amount>', () => {
  beforeEach(() => {
    localizeTearDown();
  });

  it('uses formatAmount for formatting', async () => {
    const el = /** @type {LionInputAmount} */ (
      await fixture(`<lion-input-amount></lion-input-amount>`)
    );
    expect(el.formatter).to.equal(formatAmount);
  });

  it('formatAmount uses currency provided on webcomponent', async () => {
    // JOD displays 3 fraction digits by default
    localize.locale = 'fr-FR';
    const el = /** @type {LionInputAmount} */ (
      await fixture(
        html`<lion-input-amount currency="JOD" .modelValue="${123}"></lion-input-amount>`,
      )
    );
    expect(el.formattedValue).to.equal('123,000');
  });

  it('formatAmount uses locale provided in formatOptions', async () => {
    let el = /** @type {LionInputAmount} */ (
      await fixture(
        html`
          <lion-input-amount
            .formatOptions="${{ locale: 'en-GB' }}"
            .modelValue="${123}"
          ></lion-input-amount>
        `,
      )
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

  it('supports overriding decimalSeparator in formatOptions', async () => {
    const el = /** @type {LionInputAmount} */ (
      await fixture(
        html`<lion-input-amount
          .formatOptions="${{ locale: 'nl-NL', decimalSeparator: '.' }}"
          .modelValue="${99}"
        ></lion-input-amount>`,
      )
    );
    expect(el.formattedValue).to.equal('99.00');
  });

  it('ignores global locale change if property is provided', async () => {
    const el = /** @type {LionInputAmount} */ (
      await fixture(html`
        <lion-input-amount .modelValue=${123456.78} .locale="${'en-GB'}"></lion-input-amount>
      `)
    );
    expect(el.formattedValue).to.equal('123,456.78'); // British
    localize.locale = 'nl-NL';
    await aTimeout(0);
    expect(el.formattedValue).to.equal('123,456.78'); // should stay British
  });

  it('reformats the formattedValue when locale property changes', async () => {
    const el = /** @type {LionInputAmount} */ (
      await fixture(html`
        <lion-input-amount .modelValue=${123456.78} .locale="${'en-GB'}"></lion-input-amount>
      `)
    );
    expect(el.formattedValue).to.equal('123,456.78');
    el.locale = 'nl-NL';
    await el.updateComplete;
    expect(el.formattedValue).to.equal('123.456,78');
  });

  it('reformats the formattedValue with global locale if locale property is unset', async () => {
    const el = /** @type {LionInputAmount} */ (
      await fixture(html`
        <lion-input-amount .modelValue=${123456.78} .locale="${'nl-NL'}"></lion-input-amount>
      `)
    );
    expect(el.formattedValue).to.equal('123.456,78');
    el.locale = '';
    await el.updateComplete;
    expect(el.formattedValue).to.equal('123,456.78');
  });

  it('uses parseAmount for parsing', async () => {
    const el = /** @type {LionInputAmount} */ (
      await fixture(`<lion-input-amount></lion-input-amount>`)
    );
    expect(el.parser).to.equal(parseAmount);
  });

  it('sets correct amount of decimals', async () => {
    const el = /** @type {LionInputAmount} */ (
      await fixture(html`<lion-input-amount .modelValue=${100.123}></lion-input-amount>`)
    );
    const { _inputNode } = getInputMembers(/** @type {* & LionInput} */ (el));
    expect(_inputNode.value).to.equal('100.12');
  });

  it('sets inputmode attribute to decimal', async () => {
    const el = /** @type {LionInputAmount} */ (
      await fixture(`<lion-input-amount></lion-input-amount>`)
    );
    const { _inputNode } = getInputMembers(/** @type {* & LionInput} */ (el));
    expect(_inputNode.getAttribute('inputmode')).to.equal('decimal');
  });

  it('has type="text" to activate default keyboard on mobile with all necessary symbols', async () => {
    const el = /** @type {LionInputAmount} */ (
      await fixture(`<lion-input-amount></lion-input-amount>`)
    );
    const { _inputNode } = getInputMembers(/** @type {* & LionInput} */ (el));
    expect(_inputNode.type).to.equal('text');
  });

  it('shows no currency by default', async () => {
    const el = await fixture(`<lion-input-amount></lion-input-amount>`);
    expect(Array.from(el.children).find(child => child.slot === 'after')).to.be.undefined;
  });

  it('displays currency if provided', async () => {
    const el = /** @type {LionInputAmount} */ (
      await fixture(`<lion-input-amount currency="EUR"></lion-input-amount>`)
    );
    expect(
      /** @type {HTMLElement[]} */ (Array.from(el.children)).find(child => child.slot === 'after')
        ?.innerText,
    ).to.equal('EUR');
  });

  it('displays correct currency for TRY if locale is tr-TR', async () => {
    localize.locale = 'tr-TR';
    const el = /** @type {LionInputAmount} */ (
      await fixture(`<lion-input-amount currency="TRY"></lion-input-amount>`)
    );
    expect(
      /** @type {HTMLElement[]} */ (Array.from(el.children)).find(child => child.slot === 'after')
        ?.innerText,
    ).to.equal('TL');
  });

  it('can update currency', async () => {
    const el = /** @type {LionInputAmount} */ (
      await fixture(`<lion-input-amount currency="EUR"></lion-input-amount>`)
    );
    el.currency = 'USD';
    await el.updateComplete;
    expect(
      /** @type {HTMLElement[]} */ (Array.from(el.children)).find(child => child.slot === 'after')
        ?.innerText,
    ).to.equal('USD');
  });

  it('ignores currency if a suffix is already present', async () => {
    const el = /** @type {LionInputAmount} */ (
      await fixture(
        `<lion-input-amount currency="EUR"><span slot="suffix">my-currency</span></lion-input-amount>`,
      )
    );
    expect(
      /** @type {HTMLElement[]} */ (Array.from(el.children)).find(child => child.slot === 'suffix')
        ?.innerText,
    ).to.equal('my-currency');
    el.currency = 'EUR';
    await el.updateComplete;
    expect(
      /** @type {HTMLElement[]} */ (Array.from(el.children)).find(child => child.slot === 'suffix')
        ?.innerText,
    ).to.equal('my-currency');
  });

  it('reformats on locale changes', async () => {
    const el = /** @type {LionInputAmount} */ (
      await fixture(
        html`<lion-input-amount
          label="Price"
          currency="EUR"
          .modelValue=${123.45}
        ></lion-input-amount>`,
      )
    );
    expect(el.formattedValue).to.equal('123.45');
    localize.locale = 'nl-NL';
    await el.updateComplete;
    expect(el.formattedValue).to.equal('123,45');
  });

  it('removes the currency label when currency switches from EUR to undefined', async () => {
    const el = /** @type {LionInputAmount} */ (
      await fixture(`<lion-input-amount currency="EUR"></lion-input-amount>`)
    );
    expect(
      /** @type {HTMLElement[]} */ (Array.from(el.children)).find(child => child.slot === 'after')
        ?.innerText,
    ).to.equal('EUR');
    el.currency = undefined;
    await el.updateComplete;
    expect(
      /** @type {HTMLElement[]} */ (Array.from(el.children)).find(child => child.slot === 'after'),
    ).to.be.undefined;
  });

  it('adds the currency label when currency switches from undefined to EUR', async () => {
    const el = /** @type {LionInputAmount} */ (
      await fixture(`<lion-input-amount></lion-input-amount>`)
    );
    expect(
      /** @type {HTMLElement[]} */ (Array.from(el.children)).find(child => child.slot === 'after'),
    ).to.be.undefined;

    el.currency = 'EUR';
    await el.updateComplete;
    const currLabel = /** @type {HTMLElement[]} */ (Array.from(el.children)).find(
      child => child.slot === 'after',
    );
    expect(currLabel?.innerText).to.equal('EUR');
    expect(currLabel?.getAttribute('aria-label')).to.equal('euros');
  });

  it('sets currency label on the after element', async () => {
    const el = /** @type {LionInputAmount} */ (
      await fixture(`
        <lion-input-amount>
          <span slot="after" id="123">Currency, please</span>
        </lion-input-amount>`)
    );
    const mySlotLabel = /** @type {HTMLElement[]} */ (Array.from(el.children)).find(
      child => child.slot === 'after',
    );
    expect(mySlotLabel?.id).to.equal('123');

    el.currency = 'EUR';
    await el.updateComplete;
    const currLabel = /** @type {HTMLElement[]} */ (Array.from(el.children)).find(
      child => child.slot === 'after',
    );
    expect(currLabel).to.equal(mySlotLabel);
    expect(currLabel?.id).to.equal('123');
    expect(currLabel?.innerText).to.equal('EUR');
  });

  describe('Accessibility', () => {
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

    it('adds currency id to aria-labelledby of input', async () => {
      const el = /** @type {LionInputAmount} */ (
        await fixture(`<lion-input-amount currency="EUR"></lion-input-amount>`)
      );
      const label = /** @type {HTMLElement[]} */ (Array.from(el.children)).find(
        child => child.slot === 'after',
      );
      expect(label?.getAttribute('data-label')).to.be.not.null;
      const { _inputNode } = getInputMembers(/** @type {* & LionInput} */ (el));
      expect(_inputNode.getAttribute('aria-labelledby')).to.contain(label?.id);
    });

    it('adds an aria-label to currency slot', async () => {
      const el = /** @type {LionInputAmount} */ (
        await fixture(`<lion-input-amount currency="EUR"></lion-input-amount>`)
      );
      const label = /** @type {HTMLElement[]} */ (Array.from(el.children)).find(
        child => child.slot === 'after',
      );
      expect(label?.getAttribute('aria-label')).to.equal('euros');
      el.currency = 'USD';
      await el.updateComplete;
      expect(label?.getAttribute('aria-label')).to.equal('US dollars');
      el.currency = 'PHP';
      await el.updateComplete;
      // TODO: Chrome Intl now thinks this should be pesos instead of pisos. They're probably right.
      // We could add this to our normalize layer so other browsers also do it correctly?
      // expect(el._currencyDisplayNode?.getAttribute('aria-label')).to.equal('Philippine pisos');
    });
  });
});
