import { expect } from '@open-wc/testing';

import { localize } from '../src/localize.js';

import {
  formatNumber,
  formatNumberToParts,
  getGroupSeparator,
  getDecimalSeparator,
  getFractionDigits,
} from '../src/formatNumber.js';

describe('formatNumber', () => {
  afterEach(() => {
    // makes sure that between tests the localization is reset to default state
    document.documentElement.lang = 'en-GB';
  });

  it('displays the appropriate amount of decimal places based on currencies spec http://www.currency-iso.org/en/home/tables/table-a1.html', async () => {
    const currencyCode = { style: 'currency', currencyDisplay: 'code' };
    const currencySymbol = { style: 'currency', currencyDisplay: 'symbol' };
    expect(formatNumber(123456.789, { currency: 'EUR', ...currencyCode })).to.equal(
      'EUR 123,456.79',
    );
    expect(formatNumber(123456.789, { currency: 'EUR', ...currencySymbol })).to.equal(
      '€123,456.79',
    );
    localize.locale = 'nl-NL';
    expect(formatNumber(123456.789, { currency: 'EUR', ...currencyCode })).to.equal(
      '123.456,79 EUR',
    );
    expect(formatNumber(123456.789, { currency: 'JPY', ...currencySymbol })).to.equal('¥ 123.457');
    localize.locale = 'fr-FR';
    expect(formatNumber(123456.789, { currency: 'EUR', ...currencyCode })).to.equal(
      '123 456,79 EUR',
    );
    expect(formatNumber(123456.789, { currency: 'JPY', ...currencySymbol })).to.equal('123 457 ¥');
    localize.locale = 'de-DE';
    expect(formatNumber(123456.789, { currency: 'EUR', ...currencyCode })).to.equal(
      '123.456,79 EUR',
    );
    expect(formatNumber(123456.789, { currency: 'JPY', ...currencySymbol })).to.equal('123.457 ¥');
  });

  it('can display currency as code', async () => {
    const currencyCode = { style: 'currency', currencyDisplay: 'code' };
    localize.locale = 'nl-NL';
    expect(formatNumber(123456.789, { currency: 'EUR', ...currencyCode })).to.equal(
      '123.456,79 EUR',
    );
    expect(formatNumber(123456.789, { currency: 'USD', ...currencyCode })).to.equal(
      '123.456,79 USD',
    );
  });

  it('can display currency as symbol', async () => {
    const currencySymbol = { style: 'currency', currencyDisplay: 'symbol' };
    localize.locale = 'nl-NL';
    expect(formatNumber(123456.789, { currency: 'EUR', ...currencySymbol })).to.equal(
      '€ 123.456,79',
    );
    expect(formatNumber(123456.789, { currency: 'USD', ...currencySymbol })).to.equal(
      '$ 123.456,79',
    );
  });

  it('uses minus (and not dash) to indicate negative numbers ', async () => {
    expect(formatNumber(-12, { style: 'decimal', maximumFractionDigits: 0 })).to.equal('-12');
  });

  it('rounds (negative) numbers e.g. `roundMode: round`', async () => {
    expect(formatNumber(12.4, { style: 'decimal', maximumFractionDigits: 0 })).to.equal('12');
    expect(formatNumber(12.6, { style: 'decimal', maximumFractionDigits: 0 })).to.equal('13');

    expect(formatNumber(-12.4, { style: 'decimal', maximumFractionDigits: 0 })).to.equal('-12');
    expect(formatNumber(-12.6, { style: 'decimal', maximumFractionDigits: 0 })).to.equal('-13');
  });

  it("rounds (negative) numbers up when `roundMode: 'ceiling'`", async () => {
    expect(formatNumber(12.4, { roundMode: 'ceiling' })).to.equal('13');
    expect(formatNumber(12.6, { roundMode: 'ceiling' })).to.equal('13');

    expect(formatNumber(-12.4, { roundMode: 'ceiling' })).to.equal('-12');
    expect(formatNumber(-12.6, { roundMode: 'ceiling' })).to.equal('-12');
  });

  it('rounds (negative) numbers down when `roundMode: floor`', async () => {
    expect(formatNumber(12.4, { roundMode: 'floor' })).to.equal('12');
    expect(formatNumber(12.6, { roundMode: 'floor' })).to.equal('12');

    expect(formatNumber(-12.4, { roundMode: 'floor' })).to.equal('-13');
    expect(formatNumber(-12.6, { roundMode: 'floor' })).to.equal('-13');
  });

  it('returns empty string when NaN', async () => {
    expect(formatNumber('foo')).to.equal('');
  });

  it('returns empty string when number is undefined', async () => {
    expect(formatNumber(undefined)).to.equal('');
  });

  it('uses `localize.formatNumberOptions.returnIfNaN`', async () => {
    localize.formatNumberOptions.returnIfNaN = '-';
    expect(formatNumber('foo')).to.equal('-');
  });

  it("can set what to returns when NaN via `returnIfNaN: 'foo'`", async () => {
    expect(formatNumber('foo', { returnIfNaN: '-' })).to.equal('-');
  });

  it('uses `localize.locale`', async () => {
    expect(formatNumber(123456.789, { style: 'decimal', maximumFractionDigits: 2 })).to.equal(
      '123,456.79',
    );
    localize.locale = 'de-DE';
    expect(formatNumber(123456.789, { style: 'decimal', maximumFractionDigits: 2 })).to.equal(
      '123.456,79',
    );
  });

  it('can set locale to use', async () => {
    expect(
      formatNumber(123456.789, { locale: 'en-GB', style: 'decimal', maximumFractionDigits: 2 }),
    ).to.equal('123,456.79');
    expect(
      formatNumber(123456.789, { locale: 'de-DE', style: 'decimal', maximumFractionDigits: 2 }),
    ).to.equal('123.456,79');
  });

  it('can specify max decimal places by `maximumFractionDigits: 3`', async () => {
    expect(formatNumber(123456.789)).to.equal('123,456.789');
    expect(formatNumber(123456.789, { style: 'decimal', maximumFractionDigits: 3 })).to.equal(
      '123,456.789',
    );
    expect(formatNumber(123456.789, { style: 'decimal', maximumFractionDigits: 1 })).to.equal(
      '123,456.8',
    );
  });

  it('can specify min decimal places by `minimumFractionDigits: 3`', async () => {
    expect(formatNumber(12.3)).to.equal('12.3');
    expect(formatNumber(12.3456, { style: 'decimal', minimumFractionDigits: 3 })).to.equal(
      '12.346',
    );
    expect(formatNumber(12.3, { style: 'decimal', minimumFractionDigits: 3 })).to.equal('12.300');
  });

  it('can specify to show at least x digits by `minimumIntegerDigits: 5`', async () => {
    expect(formatNumber(123)).to.equal('123');
    expect(formatNumber(123, { minimumIntegerDigits: 5 })).to.equal('00,123');
  });

  it('can display 0 decimal places', async () => {
    expect(formatNumber(12.4, { style: 'decimal', maximumFractionDigits: 0 })).to.equal('12');
  });

  it('can give separators via getGroupSeparator() or getDecimalSeparator()', async () => {
    expect(getGroupSeparator('en-GB')).to.equal(',');
    expect(getGroupSeparator('nl-NL')).to.equal('.');
    expect(getGroupSeparator('fr-FR')).to.equal(' ');

    expect(getDecimalSeparator('en-GB')).to.equal('.');
    expect(getDecimalSeparator('nl-NL')).to.equal(',');
  });

  it('can give number of fraction digits for a certain currency via getFractionDigits()', async () => {
    expect(getFractionDigits('JOD')).to.equal(3);
    expect(getFractionDigits('EUR')).to.equal(2);
  });

  it('formats numbers correctly', async () => {
    localize.locale = 'nl-NL';
    expect(formatNumber(0, { style: 'decimal', minimumFractionDigits: 2 })).to.equal('0,00');
    expect(formatNumber(0.1, { style: 'decimal', minimumFractionDigits: 2 })).to.equal('0,10');
    expect(formatNumber(0.12, { style: 'decimal', minimumFractionDigits: 2 })).to.equal('0,12');
    expect(
      formatNumber(0.123, { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    ).to.equal('0,12');
    expect(
      formatNumber(0.1234, {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    ).to.equal('0,12');
    expect(
      formatNumber(0.123456789, {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    ).to.equal('0,12');
    expect(formatNumber(1, { style: 'decimal', minimumFractionDigits: 2 })).to.equal('1,00');
    expect(formatNumber(1.0, { style: 'decimal', minimumFractionDigits: 2 })).to.equal('1,00');
    expect(formatNumber(1.1, { style: 'decimal', minimumFractionDigits: 2 })).to.equal('1,10');
    expect(formatNumber(1.12, { style: 'decimal', minimumFractionDigits: 2 })).to.equal('1,12');
    expect(formatNumber(1.123, { style: 'decimal', minimumFractionDigits: 2 })).to.equal('1,123');
    expect(formatNumber(1.1234, { style: 'decimal', maximumFractionDigits: 2 })).to.equal('1,12');
    expect(
      formatNumber(1.12345678, {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    ).to.equal('1,12');
    expect(formatNumber(1000, { style: 'decimal', minimumFractionDigits: 2 })).to.equal('1.000,00');
    expect(
      formatNumber(112345678, {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    ).to.equal('112.345.678,00');
  });

  it('formats 2-digit decimals correctly', async () => {
    localize.locale = 'nl-NL';
    Array.from(new Array(100), (val, index) => index).forEach(i => {
      const iString = `${i}`;
      let number = 0.0;
      number += i * 0.01;
      expect(formatNumber(number, { style: 'decimal', minimumFractionDigits: 2 })).to.equal(
        `0,${iString.padStart(2, '0')}`,
      );
    });
  });
});

describe('normalizeIntl()', () => {
  afterEach(() => {
    // makes sure that between tests the localization is reset to default state
    document.documentElement.lang = 'en-GB';
  });
  const currencyCode = { style: 'currency', currencyDisplay: 'code' };
  const currencySymbol = { style: 'currency', currencyDisplay: 'symbol' };

  it('supports British locale', async () => {
    expect(formatNumber(123456.789, { currency: 'EUR', ...currencyCode })).to.equal(
      'EUR 123,456.79',
    );
    expect(formatNumber(123456.789, { currency: 'USD', ...currencyCode })).to.equal(
      'USD 123,456.79',
    );
    expect(formatNumber(123456.789, { currency: 'EUR', ...currencySymbol })).to.equal(
      '€123,456.79',
    );
    expect(formatNumber(123456.789, { currency: 'USD', ...currencySymbol })).to.equal(
      '$123,456.79',
    );
  });

  it('supports US locale', async () => {
    localize.locale = 'en-US';
    expect(formatNumber(123456.789, { currency: 'EUR', ...currencyCode })).to.equal(
      'EUR 123,456.79',
    );
    expect(formatNumber(123456.789, { currency: 'USD', ...currencyCode })).to.equal(
      'USD 123,456.79',
    );
    expect(formatNumber(123456.789, { currency: 'EUR', ...currencySymbol })).to.equal(
      '€123,456.79',
    );
    expect(formatNumber(123456.789, { currency: 'USD', ...currencySymbol })).to.equal(
      '$123,456.79',
    );
  });

  it('supports Bulgarian locale', async () => {
    localize.locale = 'bg-BG';
    expect(formatNumber(123456.789, { currency: 'EUR', ...currencyCode })).to.equal(
      '123 456,79 EUR',
    );
    expect(formatNumber(1234567890.789, { currency: 'USD', ...currencyCode })).to.equal(
      '1 234 567 890,79 USD',
    );
    expect(formatNumber(12.789, { currency: 'EUR', ...currencyCode })).to.equal('12,79 EUR');
    expect(formatNumber(12, { currency: 'USD', ...currencyCode })).to.equal('12,00 USD');
    expect(formatNumber(12.789, { style: 'decimal' })).to.equal('12,789');
    expect(formatNumber(12, { style: 'decimal', minimumFractionDigits: 3 })).to.equal('12,000');
    expect(formatNumber(20000, { style: 'decimal', minimumFractionDigits: 3 })).to.equal(
      '20 000,000',
    );
  });
});

describe('formatNumberToParts', () => {
  afterEach(() => {
    // makes sure that between tests the localization is reset to default state
    document.documentElement.lang = 'en-GB';
  });

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
      { type: 'currency', value: '€' },
      { type: 'literal', value: ' ' },
      { type: 'integer', value: '3' },
      { type: 'group', value: '.' },
      { type: 'integer', value: '500' },
      { type: 'decimal', value: ',' },
      { type: 'fraction', value: '00' },
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
