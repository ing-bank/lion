import { html } from 'lit';
import { getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';
import { localizeTearDown } from '@lion/ui/localize-test-helpers.js';
import { MinDate, MaxDate } from '@lion/ui/form-core.js';
import { expect, fixture as _fixture } from '@open-wc/testing';
import { getInputMembers } from '@lion/ui/input-test-helpers.js';
import '@lion/ui/define/lion-input-date.js';

/**
 * @typedef {import('../src/LionInputDate.js').LionInputDate} LionInputDate
 */
const fixture = /** @type {(arg: TemplateResult) => Promise<LionInputDate>} */ (_fixture);

describe('<lion-input-date>', () => {
  const localizeManager = getLocalizeManager();

  beforeEach(() => {
    localizeTearDown();
  });

  it('returns undefined when value is empty string', async () => {
    const el = await fixture(html`<lion-input-date></lion-input-date>`);
    expect(el.parser('')).to.equal(undefined);
  });

  it('has type="text" to activate default keyboard on mobile with all necessary symbols', async () => {
    const el = await fixture(html`<lion-input-date></lion-input-date>`);
    const { _inputNode } = getInputMembers(el);
    expect(_inputNode.type).to.equal('text');
  });

  it('has validator "isDate" applied by default', async () => {
    const el = await fixture(html`<lion-input-date></lion-input-date>`);
    el.modelValue = '2005/11/10';
    expect(el.hasFeedbackFor).to.include('error');
    expect(el.validationStates).to.have.property('error');
    expect(el.validationStates.error).to.have.property('IsDate');

    el.modelValue = new Date('2005/11/10');
    expect(el.hasFeedbackFor).not.to.include('error');
    expect(el.validationStates).to.have.property('error');
    expect(el.validationStates.error).not.to.have.property('IsDate');
  });

  it("does not throw on invalid dates like new Date('20.10.'), which could happen while the user types", async () => {
    const el = await fixture(html`<lion-input-date></lion-input-date>`);
    expect(() => {
      el.modelValue = new Date('foo');
    }).to.not.throw();
  });

  it('gets validated by "MaxDate" correctly', async () => {
    const el = await fixture(html`
      <lion-input-date
        .modelValue=${new Date('2017/06/15')}
        .validators=${[new MaxDate(new Date('2017/06/14'))]}
      ></lion-input-date>
    `);
    expect(el.hasFeedbackFor).to.include('error');
    expect(el.validationStates).to.have.property('error');
    expect(el.validationStates.error).to.have.property('MaxDate');

    el.modelValue = new Date('2017/06/14');
    expect(el.hasFeedbackFor).not.to.include('error');
    expect(el.validationStates).to.have.property('error');
    expect(el.validationStates.error).not.to.have.property('MaxDate');
  });

  describe('locale', () => {
    it('uses formatOptions.locale', async () => {
      const el = await fixture(html`
        <lion-input-date
          .formatOptions="${{ locale: 'en-GB' }}"
          .modelValue=${new Date('2017/06/15')}
        ></lion-input-date>
      `);
      expect(el.formattedValue).to.equal('15/06/2017');

      const el2 = await fixture(html`
        <lion-input-date
          .formatOptions="${{ locale: 'en-US' }}"
          .modelValue=${new Date('2017/06/15')}
        ></lion-input-date>
      `);
      expect(el2.formattedValue).to.equal('06/15/2017');
    });

    it('uses global locale when formatOptions.locale is not defined', async () => {
      localizeManager.locale = 'fr-FR';
      const el = await fixture(html`
        <lion-input-date .modelValue=${new Date('2017/06/15')}></lion-input-date>
      `);
      expect(el.formattedValue).to.equal('15/06/2017');

      localizeManager.locale = 'en-US';
      const el2 = await fixture(html`
        <lion-input-date .modelValue=${new Date('2017/06/15')}></lion-input-date>
      `);
      expect(el2.formattedValue).to.equal('06/15/2017');
    });

    it('ignores global locale change if formatOptions.locale is provided', async () => {
      const el = await fixture(html`
        <lion-input-date
          .modelValue=${new Date('2017/06/15')}
          .formatOptions="${{ locale: 'en-GB' }}"
        ></lion-input-date>
      `);
      expect(el.formattedValue).to.equal('15/06/2017'); // british
      localizeManager.locale = 'en-US';
      await el.updateComplete;
      expect(el.formattedValue).to.equal('15/06/2017'); // should stay british
    });
  });

  describe('timezones', async () => {
    const dateAmsterdam = new Date(
      new Date('2017/06/15').toLocaleString('en-US', { timeZone: 'Europe/Amsterdam' }),
    );
    const dateManila = new Date(
      new Date('2017/06/15').toLocaleString('en-US', { timeZone: 'Asia/Manila' }),
    );
    const dateNewYork = new Date(
      new Date('2017/06/15').toLocaleString('en-US', { timeZone: 'America/New_York' }),
    );

    it('works with different timezones', async () => {
      const el = await fixture(html`
        <lion-input-date .modelValue=${dateAmsterdam}></lion-input-date>
      `);
      expect(el.formattedValue).to.equal('15/06/2017', 'Europe/Amsterdam');

      el.modelValue = dateManila;
      expect(el.formattedValue).to.equal('15/06/2017', 'Asia/Manila');

      el.modelValue = dateNewYork;
      expect(el.formattedValue).to.equal('14/06/2017', 'America/New_York');
    });

    it('validators work with different timezones', async () => {
      const el = await fixture(html`
        <lion-input-date
          .modelValue=${new Date('2017/06/15')}
          .validators=${[new MinDate(new Date('2017/06/14'))]}
        ></lion-input-date>
      `);
      expect(el.formattedValue).to.equal('15/06/2017', 'Europe/Amsterdam');
      expect(el.hasFeedbackFor).not.to.include('error', 'Europe/Amsterdam');

      el.modelValue = dateManila;
      expect(el.formattedValue).to.equal('15/06/2017', 'Asia/Manila');
      expect(el.hasFeedbackFor).not.to.include('error', 'Asia/Manila');

      el.modelValue = dateNewYork;
      expect(el.formattedValue).to.equal('14/06/2017', 'America/New_York');
      expect(el.hasFeedbackFor).not.to.include('error', 'America/New_York');
    });
  });

  it('is accessible', async () => {
    const el = await fixture(html`
      <lion-input-date><label slot="label">Label</label></lion-input-date>
    `);
    await expect(el).to.be.accessible();
  });

  it('is accessible when readonly', async () => {
    const el = await fixture(html`
      <lion-input-date readonly .modelValue=${new Date('2017/06/15')}
        ><label slot="label">Label</label></lion-input-date
      >
    `);
    await expect(el).to.be.accessible();
  });

  it('is accessible when disabled', async () => {
    const el = await fixture(html`
      <lion-input-date disabled><label slot="label">Label</label></lion-input-date>
    `);
    await expect(el).to.be.accessible();
  });

  it('serializes to iso format', async () => {
    const el = await fixture(html`
      <lion-input-date .modelValue="${new Date('2000/12/15')}"></lion-input-date>
    `);
    expect(el.serializedValue).to.equal('2000-12-15');
  });
});
