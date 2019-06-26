import { expect } from '@open-wc/testing';
import { localize } from '../../src/localize.js';
import { localizeTearDown } from '../../test-helpers.js';

import { formatNumber } from '../../src/number/formatNumber.js';

const currencyCode = currency => ({ style: 'currency', currencyDisplay: 'code', currency });
const currencySymbol = currency => ({ style: 'currency', currencyDisplay: 'symbol', currency });

describe('formatNumber', () => {
  afterEach(localizeTearDown);

  it('displays the appropriate amount of decimal places based on currencies spec http://www.currency-iso.org/en/home/tables/table-a1.html', async () => {
    expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('EUR 123,456.79');
    expect(formatNumber(123456.789, currencySymbol('EUR'))).to.equal('€123,456.79');
    localize.locale = 'nl-NL';
    expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('123.456,79 EUR');
    expect(formatNumber(123456.789, currencySymbol('JPY'))).to.equal('123.457 ¥');
    localize.locale = 'fr-FR';
    expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('123 456,79 EUR');
    expect(formatNumber(123456.789, currencySymbol('JPY'))).to.equal('123 457 ¥');
    localize.locale = 'de-DE';
    expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('123.456,79 EUR');
    expect(formatNumber(123456.789, currencySymbol('JPY'))).to.equal('123.457 ¥');
  });

  it('can display currency as code', async () => {
    localize.locale = 'nl-NL';
    expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('123.456,79 EUR');
    expect(formatNumber(123456.789, currencyCode('USD'))).to.equal('123.456,79 USD');
  });

  it('can display currency as symbol', async () => {
    localize.locale = 'nl-NL';
    expect(formatNumber(123456.789, currencySymbol('EUR'))).to.equal('123.456,79 €');
    expect(formatNumber(123456.789, currencySymbol('USD'))).to.equal('123.456,79 $');
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

  describe('normalization', () => {
    it('supports British locale', async () => {
      expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('EUR 123,456.79');
      expect(formatNumber(123456.789, currencyCode('USD'))).to.equal('USD 123,456.79');
      expect(formatNumber(123456.789, currencySymbol('EUR'))).to.equal('€123,456.79');
      expect(formatNumber(123456.789, currencySymbol('USD'))).to.equal('$123,456.79');
    });

    it('supports US locale', async () => {
      localize.locale = 'en-US';
      expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('EUR 123,456.79');
      expect(formatNumber(123456.789, currencyCode('USD'))).to.equal('USD 123,456.79');
      expect(formatNumber(123456.789, currencySymbol('EUR'))).to.equal('€123,456.79');
      expect(formatNumber(123456.789, currencySymbol('USD'))).to.equal('$123,456.79');
    });

    it('supports Bulgarian locale', async () => {
      localize.locale = 'bg-BG';
      expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('123 456,79 EUR');
      expect(formatNumber(1234567890.789, currencyCode('USD'))).to.equal('1 234 567 890,79 USD');
      expect(formatNumber(12.789, currencyCode('EUR'))).to.equal('12,79 EUR');
      expect(formatNumber(12, currencyCode('USD'))).to.equal('12,00 USD');
      expect(formatNumber(12.789, { style: 'decimal' })).to.equal('12,789');
      expect(formatNumber(12, { style: 'decimal', minimumFractionDigits: 3 })).to.equal('12,000');
      expect(formatNumber(20000, { style: 'decimal', minimumFractionDigits: 3 })).to.equal(
        '20 000,000',
      );
    });
  });
});
