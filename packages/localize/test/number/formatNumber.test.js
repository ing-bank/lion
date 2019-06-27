import { expect } from '@open-wc/testing';
import { localize } from '../../src/localize.js';
import { localizeTearDown } from '../../test-helpers.js';

import { formatNumber } from '../../src/number/formatNumber.js';

const currencyCode = currency => ({ style: 'currency', currencyDisplay: 'code', currency });
const currencySymbol = currency => ({ style: 'currency', currencyDisplay: 'symbol', currency });

describe('formatNumber', () => {
  afterEach(localizeTearDown);

  it('displays the appropriate amount of decimal places based on currencies spec http://www.currency-iso.org/en/home/tables/table-a1.html', () => {
    const clean = str => str.replace(/[a-zA-Z]+/g, '').trim();
    expect(clean(formatNumber(123456.789, currencyCode('JPY')))).to.equal('123,457');
    expect(clean(formatNumber(123456.789, currencyCode('EUR')))).to.equal('123,456.79');
    expect(clean(formatNumber(123456.789, currencyCode('BHD')))).to.equal('123,456.789');
  });

  it('can display currency as code', () => {
    expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('EUR 123,456.79');
    expect(formatNumber(123456.789, currencyCode('USD'))).to.equal('USD 123,456.79');
  });

  it('can display currency as symbol', () => {
    expect(formatNumber(123456.789, currencySymbol('EUR'))).to.equal('€123,456.79');
    expect(formatNumber(123456.789, currencySymbol('USD'))).to.equal('$123,456.79');
  });

  it('uses minus (and not dash) to indicate negative numbers ', () => {
    expect(formatNumber(-12, { style: 'decimal', maximumFractionDigits: 0 })).to.equal('-12');
  });

  it('rounds (negative) numbers e.g. `roundMode: round`', () => {
    expect(formatNumber(12.4, { roundMode: 'round' })).to.equal('12');
    expect(formatNumber(12.6, { roundMode: 'round' })).to.equal('13');

    expect(formatNumber(-12.4, { roundMode: 'round' })).to.equal('-12');
    expect(formatNumber(-12.6, { roundMode: 'round' })).to.equal('-13');
  });

  it("rounds (negative) numbers up when `roundMode: 'ceiling'`", () => {
    expect(formatNumber(12.4, { roundMode: 'ceiling' })).to.equal('13');
    expect(formatNumber(12.6, { roundMode: 'ceiling' })).to.equal('13');

    expect(formatNumber(-12.4, { roundMode: 'ceiling' })).to.equal('-12');
    expect(formatNumber(-12.6, { roundMode: 'ceiling' })).to.equal('-12');
  });

  it('rounds (negative) numbers down when `roundMode: floor`', () => {
    expect(formatNumber(12.4, { roundMode: 'floor' })).to.equal('12');
    expect(formatNumber(12.6, { roundMode: 'floor' })).to.equal('12');

    expect(formatNumber(-12.4, { roundMode: 'floor' })).to.equal('-13');
    expect(formatNumber(-12.6, { roundMode: 'floor' })).to.equal('-13');
  });

  it('returns empty string when NaN', () => {
    expect(formatNumber('foo')).to.equal('');
  });

  it('returns empty string when number is undefined', () => {
    expect(formatNumber(undefined)).to.equal('');
  });

  it('uses `localize.formatNumberOptions.returnIfNaN`', () => {
    const savedReturnIfNaN = localize.formatNumberOptions.returnIfNaN;

    localize.formatNumberOptions.returnIfNaN = '-';
    expect(formatNumber('foo')).to.equal('-');

    localize.formatNumberOptions.returnIfNaN = savedReturnIfNaN;
  });

  it("can set what to returns when NaN via `returnIfNaN: 'foo'`", () => {
    expect(formatNumber('foo', { returnIfNaN: '-' })).to.equal('-');
  });

  it('uses `localize.locale`', () => {
    expect(formatNumber(123456.789, { style: 'decimal', maximumFractionDigits: 2 })).to.equal(
      '123,456.79',
    );
    localize.locale = 'de-DE';
    expect(formatNumber(123456.789, { style: 'decimal', maximumFractionDigits: 2 })).to.equal(
      '123.456,79',
    );
  });

  it('can set locale to use', () => {
    expect(
      formatNumber(123456.789, { locale: 'en-GB', style: 'decimal', maximumFractionDigits: 2 }),
    ).to.equal('123,456.79');
    expect(
      formatNumber(123456.789, { locale: 'de-DE', style: 'decimal', maximumFractionDigits: 2 }),
    ).to.equal('123.456,79');
  });

  it('can specify max decimal places by `maximumFractionDigits: 3`', () => {
    expect(formatNumber(123456.789)).to.equal('123,456.789');
    expect(formatNumber(123456.789, { style: 'decimal', maximumFractionDigits: 3 })).to.equal(
      '123,456.789',
    );
    expect(formatNumber(123456.789, { style: 'decimal', maximumFractionDigits: 1 })).to.equal(
      '123,456.8',
    );
  });

  it('can specify min decimal places by `minimumFractionDigits: 3`', () => {
    expect(formatNumber(12.3)).to.equal('12.3');
    expect(formatNumber(12.3456, { style: 'decimal', minimumFractionDigits: 3 })).to.equal(
      '12.346',
    );
    expect(formatNumber(12.3, { style: 'decimal', minimumFractionDigits: 3 })).to.equal('12.300');
  });

  it('can specify to show at least x digits by `minimumIntegerDigits: 5`', () => {
    expect(formatNumber(123)).to.equal('123');
    expect(formatNumber(123, { minimumIntegerDigits: 5 })).to.equal('00,123');
  });

  it('can display 0 decimal places', () => {
    expect(formatNumber(12.4, { style: 'decimal', maximumFractionDigits: 0 })).to.equal('12');
  });

  it('formats numbers correctly', () => {
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

  it('formats 2-digit decimals correctly', () => {
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
    describe('en-GB', () => {
      it('supports basics', () => {
        localize.locale = 'en-GB';
        expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('EUR 123,456.79');
        expect(formatNumber(123456.789, currencyCode('USD'))).to.equal('USD 123,456.79');
        expect(formatNumber(123456.789, currencyCode('JPY'))).to.equal('JPY 123,457');
        expect(formatNumber(123456.789, currencySymbol('EUR'))).to.equal('€123,456.79');
        expect(formatNumber(123456.789, currencySymbol('USD'))).to.equal('$123,456.79');
        expect(formatNumber(123456.789, currencySymbol('JPY'))).to.equal('¥123,457');
      });
    });

    describe('en-US', () => {
      it('supports basics', () => {
        localize.locale = 'en-US';
        expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('EUR 123,456.79');
        expect(formatNumber(123456.789, currencyCode('USD'))).to.equal('USD 123,456.79');
        expect(formatNumber(123456.789, currencyCode('JPY'))).to.equal('JPY 123,457');
        expect(formatNumber(123456.789, currencySymbol('EUR'))).to.equal('€123,456.79');
        expect(formatNumber(123456.789, currencySymbol('USD'))).to.equal('$123,456.79');
        expect(formatNumber(123456.789, currencySymbol('JPY'))).to.equal('¥123,457');
      });
    });

    describe('en-AU', () => {
      it('supports basics', () => {
        localize.locale = 'en-AU';
        expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('EUR 123,456.79');
        expect(formatNumber(123456.789, currencyCode('USD'))).to.equal('USD 123,456.79');
        expect(formatNumber(123456.789, currencyCode('JPY'))).to.equal('JPY 123,457');
        // expect(formatNumber(123456.789, currencySymbol('EUR'))).to.equal('€123,456.79'); // TODO: fix
        // expect(formatNumber(123456.789, currencySymbol('USD'))).to.equal('$123,456.79'); // TODO: fix
        // expect(formatNumber(123456.789, currencySymbol('JPY'))).to.equal('¥123,457'); // TODO: fix
      });
    });

    describe('en-PH', () => {
      it('supports basics', () => {
        localize.locale = 'en-PH';
        expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('EUR 123,456.79');
        expect(formatNumber(123456.789, currencyCode('USD'))).to.equal('USD 123,456.79');
        expect(formatNumber(123456.789, currencyCode('JPY'))).to.equal('JPY 123,457');
        expect(formatNumber(123456.789, currencySymbol('EUR'))).to.equal('€123,456.79');
        expect(formatNumber(123456.789, currencySymbol('USD'))).to.equal('$123,456.79');
        expect(formatNumber(123456.789, currencySymbol('JPY'))).to.equal('¥123,457');
      });
    });

    describe('nl-NL', () => {
      it('supports basics', () => {
        localize.locale = 'nl-NL';
        expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('123.456,79 EUR');
        expect(formatNumber(123456.789, currencyCode('USD'))).to.equal('123.456,79 USD');
        expect(formatNumber(123456.789, currencyCode('JPY'))).to.equal('123.457 JPY');
        expect(formatNumber(123456.789, currencySymbol('EUR'))).to.equal('€ 123.456,79');
        expect(formatNumber(123456.789, currencySymbol('USD'))).to.equal('$ 123.456,79');
        expect(formatNumber(123456.789, currencySymbol('JPY'))).to.equal('¥ 123.457');
      });
    });

    describe('nl-BE', () => {
      it('supports basics', () => {
        localize.locale = 'nl-BE';
        expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('123.456,79 EUR');
        expect(formatNumber(123456.789, currencyCode('USD'))).to.equal('123.456,79 USD');
        expect(formatNumber(123456.789, currencyCode('JPY'))).to.equal('123.457 JPY');
        expect(formatNumber(123456.789, currencySymbol('EUR'))).to.equal('€ 123.456,79');
        expect(formatNumber(123456.789, currencySymbol('USD'))).to.equal('$ 123.456,79');
        expect(formatNumber(123456.789, currencySymbol('JPY'))).to.equal('¥ 123.457');
      });
    });

    describe('fr-FR', () => {
      it('supports basics', () => {
        localize.locale = 'fr-FR';
        expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('123 456,79 EUR');
        expect(formatNumber(123456.789, currencyCode('USD'))).to.equal('123 456,79 USD');
        expect(formatNumber(123456.789, currencyCode('JPY'))).to.equal('123 457 JPY');
        expect(formatNumber(123456.789, currencySymbol('EUR'))).to.equal('123 456,79 €');
        expect(formatNumber(123456.789, currencySymbol('USD'))).to.equal('123 456,79 $');
        expect(formatNumber(123456.789, currencySymbol('JPY'))).to.equal('123 457 ¥');
      });
    });

    describe('fr-BE', () => {
      it('supports basics', () => {
        localize.locale = 'fr-FR';
        expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('123 456,79 EUR');
        expect(formatNumber(123456.789, currencyCode('USD'))).to.equal('123 456,79 USD');
        expect(formatNumber(123456.789, currencyCode('JPY'))).to.equal('123 457 JPY');
        expect(formatNumber(123456.789, currencySymbol('EUR'))).to.equal('123 456,79 €');
        expect(formatNumber(123456.789, currencySymbol('USD'))).to.equal('123 456,79 $');
        expect(formatNumber(123456.789, currencySymbol('JPY'))).to.equal('123 457 ¥');
      });
    });

    describe('bg-BG', () => {
      it('supports basics', () => {
        localize.locale = 'bg-BG';
        expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('123 456,79 EUR');
        expect(formatNumber(123456.789, currencyCode('USD'))).to.equal('123 456,79 USD');
        expect(formatNumber(123456.789, currencyCode('JPY'))).to.equal('123 457 JPY');
        expect(formatNumber(123456.789, currencySymbol('EUR'))).to.equal('123 456,79 €');
        // expect(formatNumber(123456.789, currencySymbol('USD'))).to.equal('123 456,79 $'); // TODO: fix
        // expect(formatNumber(123456.789, currencySymbol('JPY'))).to.equal('123 457 ¥'); // TODO: fix
      });

      it('normalizes group separator', () => {
        localize.locale = 'bg-BG';
        expect(formatNumber(1.234, currencyCode('EUR'))).to.equal('1,23 EUR');
        expect(formatNumber(1234.567, currencyCode('EUR'))).to.equal('1 234,57 EUR');
      });
    });
  });
});
