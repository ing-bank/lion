import { expect } from '@open-wc/testing';
import { localize } from '../../src/localize.js';
import { localizeTearDown } from '../../test-helpers.js';

import { formatNumberToParts } from '../../src/number/formatNumberToParts.js';

const c = v => ({ type: 'currency', value: v });
const d = v => ({ type: 'decimal', value: v });
const i = v => ({ type: 'integer', value: v });
const f = v => ({ type: 'fraction', value: v });
const g = v => ({ type: 'group', value: v });
const l = v => ({ type: 'literal', value: v });
const m = { type: 'minusSign', value: '−' };

const stringifyParts = parts => parts.map(part => part.value).join('');

describe('formatNumberToParts', () => {
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
      it(`formats ${locale} ${currency} ${amount} as "${stringifyParts(expectedResult)}"`, () => {
        localize.locale = locale;
        expect(
          formatNumberToParts(amount, {
            style: 'currency',
            currency,
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
      it(`formats ${locale} ${currency} ${amount} as "${stringifyParts(expectedResult)}"`, () => {
        localize.locale = locale;
        expect(
          formatNumberToParts(amount, {
            style: 'currency',
            currencyDisplay: 'code',
            currency,
          }),
        ).to.deep.equal(expectedResult);
      });
    });
  });

  describe("style: 'decimal'", () => {
    describe('no minimumFractionDigits', () => {
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
        it(`formats ${locale} ${amount} as "${stringifyParts(expectedResult)}"`, () => {
          localize.locale = locale;
          expect(
            formatNumberToParts(amount, {
              style: 'decimal',
            }),
          ).to.deep.equal(expectedResult);
        });
      });
    });

    describe('minimumFractionDigits: 2', () => {
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
        it(`formats ${locale} ${amount} as "${stringifyParts(expectedResult)}"`, () => {
          localize.locale = locale;
          expect(
            formatNumberToParts(amount, {
              style: 'decimal',
              minimumFractionDigits: 2,
            }),
          ).to.deep.equal(expectedResult);
        });
      });
    });
  });
});
