import { expect } from '@open-wc/testing';
import { getLocalizeManager, formatNumberToParts } from '@lion/ui/localize-no-side-effects.js';
import { localizeTearDown } from '@lion/ui/localize-test-helpers.js';

// TODO: This is broken only in Safari 13.1.2 Wait till ci is on 13.1.3 and remove
const isSafari = (() => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1;
})();

const c = /** @param {string} v */ v => ({
  type: 'currency',
  value: v,
});
const d = /** @param {string} v */ v => ({ type: 'decimal', value: v });
const i = /** @param {string} v */ v => ({ type: 'integer', value: v });
const f = /** @param {string} v */ v => ({ type: 'fraction', value: v });
const g = /** @param {string} v */ v => ({ type: 'group', value: v });
const l = /** @param {string} v */ v => ({ type: 'literal', value: v });
const m = { type: 'minusSign', value: '−' };

const stringifyParts =
  /**
   * @typedef {import('../../types/LocalizeMixinTypes.js').FormatNumberPart} FormatNumberPart
   * @param {FormatNumberPart[]} parts
   * @returns {string}
   */
  parts => parts.map(part => part.value).join('');

describe('formatNumberToParts', () => {
  const localizeManager = getLocalizeManager();

  afterEach(localizeTearDown);

  describe("style: 'currency symbol'", () => {
    const specs = [
      ['en-GB', 'EUR', 1234.5, [c('€'), i('1'), g(','), i('234'), d('.'), f('50')]],
      ['en-GB', 'USD', 1234.5, [c('US$'), i('1'), g(','), i('234'), d('.'), f('50')]],
      ['nl-NL', 'EUR', 1234.5, [c('€'), l(' '), i('1'), g('.'), i('234'), d(','), f('50')]],
      ['nl-NL', 'USD', 1234.5, [c('US$'), l(' '), i('1'), g('.'), i('234'), d(','), f('50')]],
      ['nl-BE', 'EUR', 1234.5, [c('€'), l(' '), i('1'), g('.'), i('234'), d(','), f('50')]],
      ['nl-BE', 'USD', 1234.5, [c('US$'), l(' '), i('1'), g('.'), i('234'), d(','), f('50')]],
      ['fr-FR', 'EUR', 1234.5, [i('1'), g(' '), i('234'), d(','), f('50'), l(' '), c('€')]],
      ['fr-FR', 'USD', 1234.5, [i('1'), g(' '), i('234'), d(','), f('50'), l(' '), c('$US')]],
      ['fr-BE', 'EUR', 1234.5, [i('1'), g(' '), i('234'), d(','), f('50'), l(' '), c('€')]],
      ['fr-BE', 'USD', 1234.5, [i('1'), g(' '), i('234'), d(','), f('50'), l(' '), c('$US')]],
    ];

    specs.forEach(([locale, currency, amount, expectedResult]) => {
      it(`formats ${locale} ${currency} ${amount} as "${stringifyParts(
        /** @type {FormatNumberPart[]} */ (expectedResult),
      )}"`, () => {
        // TODO: This is broken only in Safari 13.1.2 Wait till ci is on 13.1.3 and remove
        if (isSafari) {
          return;
        }

        expect(
          formatNumberToParts(Number(amount), {
            style: 'currency',
            locale: String(locale),
            currency: String(currency),
          }),
        ).to.deep.equal(expectedResult);
      });
    });
  });

  describe("style: 'currency code'", () => {
    const specs = [
      ['en-GB', 'EUR', 1234.5, [c('EUR'), l(' '), i('1'), g(','), i('234'), d('.'), f('50')]],
      ['en-GB', 'EUR', -1234.5, [m, c('EUR'), l(' '), i('1'), g(','), i('234'), d('.'), f('50')]],
      ['nl-NL', 'EUR', 1234.5, [i('1'), g('.'), i('234'), d(','), f('50'), l(' '), c('EUR')]],
      ['nl-NL', 'EUR', -1234.5, [m, i('1'), g('.'), i('234'), d(','), f('50'), l(' '), c('EUR')]],
      ['nl-BE', 'EUR', 1234.5, [i('1'), g('.'), i('234'), d(','), f('50'), l(' '), c('EUR')]],
      ['nl-BE', 'EUR', -1234.5, [m, i('1'), g('.'), i('234'), d(','), f('50'), l(' '), c('EUR')]],
      ['fr-FR', 'EUR', 1234.5, [i('1'), g(' '), i('234'), d(','), f('50'), l(' '), c('EUR')]],
      ['fr-FR', 'EUR', -1234.5, [m, i('1'), g(' '), i('234'), d(','), f('50'), l(' '), c('EUR')]],
      ['fr-BE', 'EUR', 1234.5, [i('1'), g(' '), i('234'), d(','), f('50'), l(' '), c('EUR')]],
      ['fr-BE', 'EUR', -1234.5, [m, i('1'), g(' '), i('234'), d(','), f('50'), l(' '), c('EUR')]],
    ];

    specs.forEach(([locale, currency, amount, expectedResult]) => {
      it(`formats ${locale} ${currency} ${amount} as "${stringifyParts(
        /** @type {FormatNumberPart[]} */ (expectedResult),
      )}"`, () => {
        expect(
          formatNumberToParts(Number(amount), {
            style: 'currency',
            currencyDisplay: 'code',
            locale: String(locale),
            currency: String(currency),
          }),
        ).to.deep.equal(expectedResult);
      });
    });
  });

  describe("style: 'decimal'", () => {
    describe('no minimumFractionDigits', () => {
      /** @type {Array.<Array.<?>>} */
      const specs = [
        ['en-GB', 3500, [i('3'), g(','), i('500')]],
        ['en-GB', -3500, [m, i('3'), g(','), i('500')]],
        ['nl-NL', 3500, [i('3'), g('.'), i('500')]],
        ['nl-NL', -3500, [m, i('3'), g('.'), i('500')]],
        ['nl-BE', 3500, [i('3'), g('.'), i('500')]],
        ['nl-BE', -3500, [m, i('3'), g('.'), i('500')]],
        ['fr-FR', 3500, [i('3'), g(' '), i('500')]],
        ['fr-FR', -3500, [m, i('3'), g(' '), i('500')]],
        ['fr-BE', 3500, [i('3'), g(' '), i('500')]],
        ['fr-BE', -3500, [m, i('3'), g(' '), i('500')]],
      ];

      specs.forEach(([locale, amount, expectedResult]) => {
        it(`formats ${locale} ${amount} as "${stringifyParts(
          /** @type {FormatNumberPart[]} */ (expectedResult),
        )}"`, () => {
          localizeManager.locale = locale;
          expect(
            formatNumberToParts(Number(amount), {
              style: 'decimal',
            }),
          ).to.deep.equal(expectedResult);
        });
      });
    });

    describe('minimumFractionDigits: 2', () => {
      /** @type {Array.<Array.<?>>} */
      const specs = [
        ['en-GB', 3500, [i('3'), g(','), i('500'), d('.'), f('00')]],
        ['en-GB', -3500, [m, i('3'), g(','), i('500'), d('.'), f('00')]],
        ['nl-NL', 3500, [i('3'), g('.'), i('500'), d(','), f('00')]],
        ['nl-NL', -3500, [m, i('3'), g('.'), i('500'), d(','), f('00')]],
        ['nl-BE', 3500, [i('3'), g('.'), i('500'), d(','), f('00')]],
        ['nl-BE', -3500, [m, i('3'), g('.'), i('500'), d(','), f('00')]],
        ['fr-FR', 3500, [i('3'), g(' '), i('500'), d(','), f('00')]],
        ['fr-FR', -3500, [m, i('3'), g(' '), i('500'), d(','), f('00')]],
        ['fr-BE', 3500, [i('3'), g(' '), i('500'), d(','), f('00')]],
        ['fr-BE', -3500, [m, i('3'), g(' '), i('500'), d(','), f('00')]],
      ];

      specs.forEach(([locale, amount, expectedResult]) => {
        it(`formats ${locale} ${amount} as "${stringifyParts(
          /** @type {FormatNumberPart[]} */ (expectedResult),
        )}"`, () => {
          localizeManager.locale = locale;
          expect(
            formatNumberToParts(Number(amount), {
              style: 'decimal',
              minimumFractionDigits: 2,
            }),
          ).to.deep.equal(expectedResult);
        });
      });
    });
  });

  describe("style: 'percent'", () => {
    const specs = [
      ['en-GB', 1234.5, [i('1'), g(','), i('234'), d('.'), f('50'), c('%')]],
      ['en-GB', -1234.5, [m, i('1'), g(','), i('234'), d('.'), f('50'), c('%')]],
      ['nl-NL', 1234.5, [i('1'), g('.'), i('234'), d(','), f('50'), c('%')]],
      ['nl-NL', -1234.5, [m, i('1'), g('.'), i('234'), d(','), f('50'), c('%')]],
      ['nl-BE', 1234.5, [i('1'), g('.'), i('234'), d(','), f('50'), c('%')]],
      ['nl-BE', -1234.5, [m, i('1'), g('.'), i('234'), d(','), f('50'), c('%')]],
      ['fr-FR', 1234.5, [i('1'), g(' '), i('234'), d(','), f('50'), l(' '), c('%')]],
      ['fr-FR', -1234.5, [m, i('1'), g(' '), i('234'), d(','), f('50'), l(' '), c('%')]],
      ['fr-BE', 1234.5, [i('1'), g(' '), i('234'), d(','), f('50'), l(' '), c('%')]],
      ['fr-BE', -1234.5, [m, i('1'), g(' '), i('234'), d(','), f('50'), l(' '), c('%')]],
    ];

    specs.forEach(([locale, amount, expectedResult]) => {
      it(`formats ${locale} ${amount} as "${stringifyParts(
        /** @type {FormatNumberPart[]} */ (expectedResult),
      )}"`, () => {
        expect(
          formatNumberToParts(Number(amount) / 100, {
            style: 'percent',
            minimumFractionDigits: 2,
            locale: String(locale),
          }),
        ).to.deep.equal(expectedResult);
      });
    });
  });
});
