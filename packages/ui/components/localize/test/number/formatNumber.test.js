import { expect } from '@open-wc/testing';
import { getLocalizeManager, formatNumber } from '@lion/ui/localize-no-side-effects.js';
import { localizeTearDown } from '@lion/ui/localize-test-helpers.js';

const currencyCode = /** @param {string} currency */ currency => ({
  style: /** @type {keyof Intl.NumberFormatOptionsStyleRegistry} */ ('currency'),
  currencyDisplay: /** @type {Intl.NumberFormatOptions['currencyDisplay']} */ ('code'),
  currency,
});
const currencySymbol = /** @param {string} currency */ currency => ({
  style: /** @type {keyof Intl.NumberFormatOptionsStyleRegistry} */ ('currency'),
  currencyDisplay: /** @type {Intl.NumberFormatOptions['currencyDisplay']} */ ('symbol'),
  currency,
});

describe('formatNumber', () => {
  const localizeManager = getLocalizeManager();

  afterEach(localizeTearDown);

  it('displays the appropriate amount of decimal places based on currencies spec http://www.currency-iso.org/en/home/tables/table-a1.html', () => {
    const clean = /** @param {string} str */ str => str.replace(/[a-zA-Z]+/g, '').trim();
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
    expect(formatNumber(123456.789, currencySymbol('USD'))).to.equal('US$123,456.79');
  });

  it('uses minus U+2212 (and not dash) to indicate negative numbers ', () => {
    expect(formatNumber(-12, { style: 'decimal', maximumFractionDigits: 0 })).to.equal('−12');
  });

  it('rounds (negative) numbers e.g. `roundMode: round`', () => {
    expect(formatNumber(12.4, { roundMode: 'round' })).to.equal('12');
    expect(formatNumber(12.6, { roundMode: 'round' })).to.equal('13');

    expect(formatNumber(-12.4, { roundMode: 'round' })).to.equal('−12');
    expect(formatNumber(-12.6, { roundMode: 'round' })).to.equal('−13');
  });

  it("rounds (negative) numbers up when `roundMode: 'ceiling'`", () => {
    expect(formatNumber(12.4, { roundMode: 'ceiling' })).to.equal('13');
    expect(formatNumber(12.6, { roundMode: 'ceiling' })).to.equal('13');

    expect(formatNumber(-12.4, { roundMode: 'ceiling' })).to.equal('−12');
    expect(formatNumber(-12.6, { roundMode: 'ceiling' })).to.equal('−12');
  });

  it('rounds (negative) numbers down when `roundMode: floor`', () => {
    expect(formatNumber(12.4, { roundMode: 'floor' })).to.equal('12');
    expect(formatNumber(12.6, { roundMode: 'floor' })).to.equal('12');

    expect(formatNumber(-12.4, { roundMode: 'floor' })).to.equal('−13');
    expect(formatNumber(-12.6, { roundMode: 'floor' })).to.equal('−13');
  });

  it('returns empty string when passing wrong type', () => {
    // @ts-ignore tests what happens if you pass wrong type
    expect(formatNumber('foo')).to.equal('');
    // @ts-ignore tests what happens if you pass wrong type
    expect(formatNumber(undefined)).to.equal('');
  });

  it('uses `localizeManager.formatNumberOptions.returnIfNaN`', () => {
    const savedReturnIfNaN = localizeManager.formatNumberOptions.returnIfNaN;

    localizeManager.formatNumberOptions.returnIfNaN = '-';
    // @ts-ignore
    expect(formatNumber('foo')).to.equal('-');

    localizeManager.formatNumberOptions.returnIfNaN = savedReturnIfNaN;
  });

  it("can set what to returns when NaN via `returnIfNaN: 'foo'`", () => {
    // @ts-ignore
    expect(formatNumber('foo', { returnIfNaN: '-' })).to.equal('-');
  });

  it('uses `localizeManager.locale`', () => {
    expect(formatNumber(123456.789, { style: 'decimal', maximumFractionDigits: 2 })).to.equal(
      '123,456.79',
    );
    localizeManager.locale = 'de-DE';
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
    localizeManager.locale = 'nl-NL';
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
    expect(
      formatNumber(112345678, {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        groupSeparator: ' ',
        decimalSeparator: '.',
      }),
    ).to.equal('112 345 678.00');
  });

  it('throws when decimal and group separator are the same value, only when problematic', () => {
    localizeManager.locale = 'nl-NL';
    const fn = () =>
      formatNumber(112345678, {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        decimalSeparator: '.', // same as group separator for nl-NL
      });

    expect(fn).to.throw(`Decimal and group (thousand) separator are the same character: '.'.
This can happen due to both props being specified as the same, or one of the props being the same as the other one from default locale.
Please specify .groupSeparator / .decimalSeparator on the formatOptions object to be different.`);

    const fn2 = () =>
      formatNumber(112345678, {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        groupSeparator: ',',
        decimalSeparator: ',',
      });

    expect(fn2).to.throw(`Decimal and group (thousand) separator are the same character: ','.
This can happen due to both props being specified as the same, or one of the props being the same as the other one from default locale.
Please specify .groupSeparator / .decimalSeparator on the formatOptions object to be different.`);

    // this one doesn't end up with decimals, so not a problem
    const fn3 = () =>
      formatNumber(112345678, {
        groupSeparator: ',',
        decimalSeparator: ',',
      });

    expect(fn3).to.not.throw();

    // this one doesn't end up with group separators (<1000), so not a problem
    const fn4 = () =>
      formatNumber(112.345678, {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        groupSeparator: ',',
        decimalSeparator: ',',
      });

    expect(fn4).to.not.throw();
  });

  it('formats 2-digit decimals correctly', () => {
    localizeManager.locale = 'nl-NL';
    Array.from(new Array(100), (val, index) => index).forEach(i => {
      const iString = `${i}`;
      let number = 0.0;
      number += i * 0.01;
      expect(formatNumber(number, { style: 'decimal', minimumFractionDigits: 2 })).to.equal(
        `0,${iString.padStart(2, '0')}`,
      );
    });
  });

  // TODO: make it work with big numbers, e.g. make use of BigInt
  it.skip('can handle big numbers', async () => {
    expect(formatNumber(1e21)).to.equal('1,000,000,000,000,000,000,000');
    // eslint-disable-next-line no-loss-of-precision
    expect(formatNumber(999999999999999999999.42)).to.equal('999,999,999,999,999,999,999.42');
    // eslint-disable-next-line no-loss-of-precision
    expect(formatNumber(12345678987654321.42)).to.equal('12,345,678,987,654,321.42');
  });

  describe('normalization', () => {
    describe('en-GB', () => {
      it('supports basics', () => {
        localizeManager.locale = 'en-GB';
        expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('EUR 123,456.79');
        expect(formatNumber(123456.789, currencyCode('USD'))).to.equal('USD 123,456.79');
        expect(formatNumber(123456.789, currencyCode('JPY'))).to.equal('JPY 123,457');
        expect(formatNumber(123456.789, currencySymbol('EUR'))).to.equal('€123,456.79');
        expect(formatNumber(123456.789, currencySymbol('USD'))).to.equal('US$123,456.79');
        expect(formatNumber(123456.789, currencySymbol('JPY'))).to.equal('JP¥123,457');
      });
    });

    describe('en-US', () => {
      it('supports basics', () => {
        localizeManager.locale = 'en-US';
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
        localizeManager.locale = 'en-AU';
        expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('EUR 123,456.79');
        expect(formatNumber(123456.789, currencyCode('USD'))).to.equal('USD 123,456.79');
        expect(formatNumber(123456.789, currencyCode('JPY'))).to.equal('JPY 123,457');
        expect(formatNumber(123456.789, currencySymbol('EUR'))).to.equal('€123,456.79');
        expect(formatNumber(-123456.789, currencySymbol('EUR'))).to.equal('−€123,456.79');
        expect(formatNumber(123456.789, currencySymbol('USD'))).to.equal('$123,456.79');
        expect(formatNumber(-123456.789, currencySymbol('USD'))).to.equal('−$123,456.79');
        expect(formatNumber(123456.789, currencySymbol('JPY'))).to.equal('¥123,457');
        expect(formatNumber(-123456.789, currencySymbol('JPY'))).to.equal('−¥123,457');
      });
    });

    describe('en-PH', () => {
      it('supports basics', () => {
        localizeManager.locale = 'en-PH';
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
        localizeManager.locale = 'nl-NL';
        expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('123.456,79 EUR');
        expect(formatNumber(123456.789, currencyCode('USD'))).to.equal('123.456,79 USD');
        expect(formatNumber(123456.789, currencyCode('JPY'))).to.equal('123.457 JPY');
        expect(formatNumber(123456.789, currencySymbol('EUR'))).to.equal('€ 123.456,79');
        expect(formatNumber(123456.789, currencySymbol('USD'))).to.equal('US$ 123.456,79');
        expect(formatNumber(123456.789, currencySymbol('JPY'))).to.equal('JP¥ 123.457');
      });
    });

    describe('nl-BE', () => {
      it('supports basics', () => {
        localizeManager.locale = 'nl-BE';
        expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('123.456,79 EUR');
        expect(formatNumber(123456.789, currencyCode('USD'))).to.equal('123.456,79 USD');
        expect(formatNumber(123456.789, currencyCode('JPY'))).to.equal('123.457 JPY');
        expect(formatNumber(123456.789, currencySymbol('EUR'))).to.equal('€ 123.456,79');
        expect(formatNumber(123456.789, currencySymbol('USD'))).to.equal('US$ 123.456,79');
        expect(formatNumber(123456.789, currencySymbol('JPY'))).to.equal('JP¥ 123.457');
      });
    });

    describe('fr-FR', () => {
      it('supports basics', () => {
        localizeManager.locale = 'fr-FR';
        expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('123 456,79 EUR');
        expect(formatNumber(123456.789, currencyCode('USD'))).to.equal('123 456,79 USD');
        expect(formatNumber(123456.789, currencyCode('JPY'))).to.equal('123 457 JPY');
        expect(formatNumber(123456.789, currencySymbol('EUR'))).to.equal('123 456,79 €');
        expect(formatNumber(123456.789, currencySymbol('USD'))).to.equal('123 456,79 $US');
        expect(formatNumber(123456.789, currencySymbol('JPY'))).to.equal('123 457 ¥');
      });
    });

    describe('fr-BE', () => {
      it('supports basics', () => {
        localizeManager.locale = 'fr-BE';
        expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('123 456,79 EUR');
        expect(formatNumber(123456.789, currencyCode('USD'))).to.equal('123 456,79 USD');
        expect(formatNumber(123456.789, currencyCode('JPY'))).to.equal('123 457 JPY');
        expect(formatNumber(123456.789, currencySymbol('EUR'))).to.equal('123 456,79 €');
        expect(formatNumber(123456.789, currencySymbol('USD'))).to.equal('123 456,79 $US');
        expect(formatNumber(123456.789, currencySymbol('JPY'))).to.equal('123 457 ¥');
      });
    });

    describe('bg-BG', () => {
      it('supports basics', () => {
        localizeManager.locale = 'bg-BG';
        expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('123 456,79 EUR');
        expect(formatNumber(123456.789, currencyCode('USD'))).to.equal('123 456,79 USD');
        expect(formatNumber(123456.789, currencyCode('JPY'))).to.equal('123 457 JPY');
        expect(formatNumber(123456.789, currencySymbol('EUR'))).to.equal('123 456,79 €');
        // expect(formatNumber(123456.789, currencySymbol('USD'))).to.equal('123 456,79 $'); // TODO: fix
        // expect(formatNumber(123456.789, currencySymbol('JPY'))).to.equal('123 457 ¥'); // TODO: fix
      });

      it('normalizes group separator', () => {
        localizeManager.locale = 'bg-BG';
        expect(formatNumber(1.234, currencyCode('EUR'))).to.equal('1,23 EUR');
        expect(formatNumber(1234.567, currencyCode('EUR'))).to.equal('1 234,57 EUR');
        expect(formatNumber(-1234.567, currencyCode('EUR'))).to.equal('−1 234,57 EUR');
      });
    });

    describe('cs-CZ', () => {
      it('supports basics', () => {
        localizeManager.locale = 'cs-CZ';
        expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('123 456,79 EUR');
        expect(formatNumber(123456.789, currencyCode('USD'))).to.equal('123 456,79 USD');
        expect(formatNumber(123456.789, currencyCode('JPY'))).to.equal('123 457 JPY');
        expect(formatNumber(123456.789, currencyCode('CZK'))).to.equal('123 456,79 CZK');
        expect(formatNumber(123456.789, currencySymbol('EUR'))).to.equal('123 456,79 €');
        expect(formatNumber(123456.789, currencySymbol('USD'))).to.equal('123 456,79 US$');
        expect(formatNumber(123456.789, currencySymbol('JPY'))).to.equal('123 457 JP¥');
        expect(formatNumber(123456.789, currencySymbol('CZK'))).to.equal('123 456,79 Kč');
      });
    });

    describe('tr-TR', () => {
      it('supports basics', () => {
        localizeManager.locale = 'tr-TR';
        expect(formatNumber(123456.789, currencyCode('EUR'))).to.equal('123.456,79 EUR');
        expect(formatNumber(123456.789, currencyCode('USD'))).to.equal('123.456,79 USD');
        expect(formatNumber(123456.789, currencyCode('JPY'))).to.equal('123.457 JPY');
        expect(formatNumber(123456.789, currencyCode('TRY'))).to.equal('123.456,79 TL');
        expect(formatNumber(123456.789, currencySymbol('EUR'))).to.equal('€123.456,79');
        expect(formatNumber(123456.789, currencySymbol('USD'))).to.equal('$123.456,79');
        expect(formatNumber(123456.789, currencySymbol('JPY'))).to.equal('¥123.457');
        expect(formatNumber(123456.789, currencySymbol('TRY'))).to.equal('₺123.456,79');
      });

      it('forces turkish currency code ', () => {
        localizeManager.locale = 'tr-TR';
        expect(
          formatNumber(1234.56, { style: 'currency', currencyDisplay: 'code', currency: 'TRY' }),
        ).to.equal('1.234,56 TL');
        expect(
          formatNumber(-1234.56, { style: 'currency', currencyDisplay: 'code', currency: 'TRY' }),
        ).to.equal('−1.234,56 TL');
      });
    });
  });

  describe('postProcessors', () => {
    /** @type {Map<string, import('../../types/LocalizeMixinTypes.js').NumberPostProcessor>} */
    let savedpostProcessors;
    beforeEach(() => {
      savedpostProcessors = localizeManager.formatNumberOptions.postProcessors;
    });
    afterEach(() => {
      localizeManager.formatNumberOptions.postProcessors = savedpostProcessors;
    });

    /**
     * Comma to spaces processor
     *
     * @param {string} str
     * @returns {string}
     */
    const commaToSpaceProcessor = str => str.replace(/,/g, ' ');

    /**
     * First space to dot processor
     *
     * @param {string} str
     * @returns {string}
     */
    const firstSpaceToDotProcessor = str => str.replace(' ', '.');

    it('uses `options.postProcessors`', () => {
      const postProcessors = new Map();
      postProcessors.set('en-GB', commaToSpaceProcessor);
      expect(
        formatNumber(112345678, {
          postProcessors,
        }),
      ).to.equal('112 345 678');
    });

    it('uses `localizeManager.formatNumberOptions.postProcessors`', () => {
      localizeManager.setNumberPostProcessorForLocale({
        locale: 'en-GB',
        postProcessor: commaToSpaceProcessor,
      });

      expect(formatNumber(112345678)).to.equal('112 345 678');
    });

    it('uses `options.postProcessors` and `localizeManager.formatNumberOptions.postProcessors`', () => {
      const postProcessors = new Map();
      postProcessors.set('en-GB', commaToSpaceProcessor);

      localizeManager.setNumberPostProcessorForLocale({
        locale: 'en-GB',
        postProcessor: firstSpaceToDotProcessor,
      });
      expect(
        formatNumber(112345678, {
          postProcessors,
        }),
      ).to.equal('112 345 678');
    });
  });
});
