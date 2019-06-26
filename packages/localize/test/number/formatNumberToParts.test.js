import { expect } from '@open-wc/testing';
import { localize } from '../../src/localize.js';
import { localizeTearDown } from '../../test-helpers.js';

import { formatNumberToParts } from '../../src/number/formatNumberToParts.js';

describe('formatNumberToParts', () => {
  afterEach(localizeTearDown);

  describe('formats based on ISO standards', () => {
    const specs = [
      ['nl-NL', 'EUR', 1234.5, '1.234,50 EUR'],
      ['nl-NL', 'USD', 1234.5, '1.234,50 USD'],
      ['nl-NL', 'EUR', -1234.5, '-1.234,50 EUR'],
      ['nl-BE', 'EUR', 1234.5, '1.234,50 EUR'],
      ['nl-BE', 'USD', 1234.5, '1.234,50 USD'],
      ['nl-BE', 'EUR', -1234.5, '-1.234,50 EUR'],
      ['en-GB', 'EUR', 1234.5, 'EUR 1,234.50'],
      ['en-GB', 'USD', 1234.5, 'USD 1,234.50'],
      ['en-GB', 'EUR', -1234.5, '-EUR 1,234.50'],
      ['de-DE', 'EUR', 1234.5, '1.234,50 EUR'],
      ['de-DE', 'USD', 1234.5, '1.234,50 USD'],
      ['de-DE', 'EUR', -1234.5, '-1.234,50 EUR'],
      ['fr-BE', 'EUR', 1234.5, '1 234,50 EUR'],
      ['fr-BE', 'USD', 1234.5, '1 234,50 USD'],
      ['fr-BE', 'EUR', -1234.5, '-1 234,50 EUR'],
    ];

    specs.forEach(spec => {
      const [locale, currency, amount, expectedResult] = spec;

      it(`formats ${locale} ${currency} ${amount} as ${expectedResult}`, () => {
        localize.locale = locale;
        const parts = formatNumberToParts(amount, {
          style: 'currency',
          currency,
          currencyDisplay: 'code',
        });
        const joinedParts = parts.map(p => p.value).join('');
        expect(joinedParts).to.equal(expectedResult);
      });
    });
  });

  it('supports currency symbol with dutch locale', async () => {
    localize.locale = 'nl-NL';
    const formattedToParts = formatNumberToParts(3500, {
      style: 'currency',
      currency: 'EUR',
      currencyDisplay: 'symbol',
    });
    expect(formattedToParts).to.eql([
      { type: 'integer', value: '3' },
      { type: 'group', value: '.' },
      { type: 'integer', value: '500' },
      { type: 'decimal', value: ',' },
      { type: 'fraction', value: '00' },
      { type: 'literal', value: ' ' },
      { type: 'currency', value: '€' },
    ]);
  });

  it('supports currency symbol with french locale', async () => {
    localize.locale = 'fr-FR';
    const formattedToParts = formatNumberToParts(3500, {
      style: 'currency',
      currency: 'EUR',
      currencyDisplay: 'symbol',
    });
    expect(Object.keys(formattedToParts).length).to.equal(7);
    expect(formattedToParts[0].type).to.equal('integer');
    expect(formattedToParts[0].value).to.equal('3');
    expect(formattedToParts[1].type).to.equal('group');
    expect(formattedToParts[1].value).to.equal(' ');
    expect(formattedToParts[5].type).to.equal('literal');
    expect(formattedToParts[5].value).to.equal(' ');
    expect(formattedToParts[6].type).to.equal('currency');
    expect(formattedToParts[6].value).to.equal('€');
  });

  it('supports currency symbol with British locale', async () => {
    localize.locale = 'en-GB';
    const formattedToParts = formatNumberToParts(3500, {
      style: 'currency',
      currency: 'EUR',
      currencyDisplay: 'symbol',
    });
    expect(Object.keys(formattedToParts).length).to.equal(6);
    expect(formattedToParts[2].type).to.equal('group');
    expect(formattedToParts[2].value).to.equal(',');
    expect(formattedToParts[4].type).to.equal('decimal');
    expect(formattedToParts[4].value).to.equal('.');
    expect(formattedToParts[5].type).to.equal('fraction');
    expect(formattedToParts[5].value).to.equal('00');
  });

  it('supports currency code with dutch locale', async () => {
    localize.locale = 'nl-NL';
    const formattedToParts = formatNumberToParts(3500, {
      style: 'currency',
      currency: 'EUR',
      currencyDisplay: 'code',
    });
    expect(Object.keys(formattedToParts).length).to.equal(7);
    expect(formattedToParts[1].type).to.equal('group');
    expect(formattedToParts[1].value).to.equal('.');
    expect(formattedToParts[3].type).to.equal('decimal');
    expect(formattedToParts[3].value).to.equal(',');
    expect(formattedToParts[5].type).to.equal('literal');
    expect(formattedToParts[5].value).to.equal(' ');
    expect(formattedToParts[6].type).to.equal('currency');
    expect(formattedToParts[6].value).to.equal('EUR');
  });

  it('supports currency code with french locale', async () => {
    localize.locale = 'fr-FR';
    const formattedToParts = formatNumberToParts(3500, {
      style: 'currency',
      currency: 'EUR',
      currencyDisplay: 'code',
    });
    expect(Object.keys(formattedToParts).length).to.equal(7);
    expect(formattedToParts[1].type).to.equal('group');
    expect(formattedToParts[1].value).to.equal(' ');
    expect(formattedToParts[3].type).to.equal('decimal');
    expect(formattedToParts[3].value).to.equal(',');
    expect(formattedToParts[4].type).to.equal('fraction');
    expect(formattedToParts[4].value).to.equal('00');
  });

  it('supports currency code with British locale', async () => {
    localize.locale = 'en-GB';
    const formattedToParts = formatNumberToParts(3500, {
      style: 'currency',
      currency: 'EUR',
      currencyDisplay: 'code',
    });
    expect(Object.keys(formattedToParts).length).to.equal(7);
    expect(formattedToParts[3].type).to.equal('group');
    expect(formattedToParts[3].value).to.equal(',');
    expect(formattedToParts[5].type).to.equal('decimal');
    expect(formattedToParts[5].value).to.equal('.');
  });

  it('supports currency with dutch locale and 2 decimals', async () => {
    localize.locale = 'nl-NL';
    const formattedToParts = formatNumberToParts(3500, {
      style: 'decimal',
      minimumFractionDigits: 2,
    });
    expect(Object.keys(formattedToParts).length).to.equal(5);
    expect(formattedToParts[0].type).to.equal('integer');
    expect(formattedToParts[0].value).to.equal('3');
    expect(formattedToParts[1].type).to.equal('group');
    expect(formattedToParts[1].value).to.equal('.');
    expect(formattedToParts[2].type).to.equal('integer');
    expect(formattedToParts[2].value).to.equal('500');
    expect(formattedToParts[3].type).to.equal('decimal');
    expect(formattedToParts[3].value).to.equal(',');
    expect(formattedToParts[4].type).to.equal('fraction');
    expect(formattedToParts[4].value).to.equal('00');
  });

  it('supports currency with french locale and 2 decimals', async () => {
    localize.locale = 'fr-FR';
    const formattedToParts = formatNumberToParts(3500, {
      style: 'decimal',
      minimumFractionDigits: 2,
    });
    expect(Object.keys(formattedToParts).length).to.equal(5);
    expect(formattedToParts[1].type).to.equal('group');
    expect(formattedToParts[1].value).to.equal(' ');
    expect(formattedToParts[3].type).to.equal('decimal');
    expect(formattedToParts[3].value).to.equal(',');
  });

  it('supports currency with british locale and 2 decimals', async () => {
    localize.locale = 'en-GB';
    const formattedToParts = formatNumberToParts(3500, {
      style: 'decimal',
      minimumFractionDigits: 2,
    });
    expect(Object.keys(formattedToParts).length).to.equal(5);
    expect(formattedToParts[1].type).to.equal('group');
    expect(formattedToParts[1].value).to.equal(',');
    expect(formattedToParts[3].type).to.equal('decimal');
    expect(formattedToParts[3].value).to.equal('.');
  });

  it('supports currency with dutch locale without decimals', async () => {
    localize.locale = 'nl-NL';
    const formattedToParts = formatNumberToParts(3500, { style: 'decimal' });
    expect(Object.keys(formattedToParts).length).to.equal(3);
    expect(formattedToParts[1].type).to.equal('group');
    expect(formattedToParts[1].value).to.equal('.');
    expect(formattedToParts[2].type).to.equal('integer');
    expect(formattedToParts[2].value).to.equal('500');
  });

  it('supports currency with french locale without decimals', async () => {
    localize.locale = 'fr-FR';
    const formattedToParts = formatNumberToParts(3500, { style: 'decimal' });
    expect(Object.keys(formattedToParts).length).to.equal(3);
    expect(formattedToParts[1].type).to.equal('group');
    expect(formattedToParts[1].value).to.equal(' ');
  });

  it('supports currency with british locale without decimals', async () => {
    localize.locale = 'en-GB';
    const formattedToParts = formatNumberToParts(3500, { style: 'decimal' });
    expect(Object.keys(formattedToParts).length).to.equal(3);
    expect(formattedToParts[1].type).to.equal('group');
    expect(formattedToParts[1].value).to.equal(',');
  });
});
