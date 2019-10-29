import { expect, fixture } from '@open-wc/testing';
import { html } from '@lion/core';
import { localizeTearDown } from '@lion/localize/test-helpers.js';

import { localize } from '@lion/localize';
import { MaxDate } from '@lion/validate';

import '../lion-input-date.js';

describe.only('<lion-input-date>', () => {
  beforeEach(() => {
    localizeTearDown();
  });

  it('returns undefined when value is empty string', async () => {
    const el = await fixture(`<lion-input-date></lion-input-date>`);
    expect(el.parser('')).to.equal(undefined);
  });

  it('has type="text" to activate default keyboard on mobile with all necessary symbols', async () => {
    const el = await fixture(`<lion-input-date></lion-input-date>`);
    expect(el.inputElement.type).to.equal('text');
  });

  it('has validator "isDate" applied by default', async () => {
    const el = await fixture(`<lion-input-date></lion-input-date>`);
    el.modelValue = '2005/11/10';
    expect(el.hasError).to.equal(true);
    el.modelValue = new Date('2005/11/10');
    expect(el.hasError).to.equal(false);
  });

  it('gets validated by "MaxDate" correctly', async () => {
    const el = await fixture(html`
      <lion-input-date
        .modelValue=${new Date('2017/06/15')}
        .validators=${[new MaxDate(new Date('2017/06/14'))]}
      ></lion-input-date>
    `);
    expect(el.hasError).to.equal(true);
    el.modelValue = new Date('2017/06/14');
    expect(el.hasError).to.equal(false);
  });

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
    localize.locale = 'fr-FR';
    const el = await fixture(html`
      <lion-input-date .modelValue=${new Date('2017/06/15')}></lion-input-date>
    `);
    expect(el.formattedValue).to.equal('15/06/2017');

    localize.locale = 'en-US';
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
    localize.locale = 'en-US';
    await el.updateComplete;
    expect(el.formattedValue).to.equal('15/06/2017'); // should stay british
  });
});
