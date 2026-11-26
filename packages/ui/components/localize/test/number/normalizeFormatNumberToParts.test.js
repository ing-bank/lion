import { expect } from '@open-wc/testing';
import { forceAddGroupSeparators } from '../../src/number/utils/normalize-format-number-to-parts/forceAddGroupSeparators.js';
import { forceSpaceBetweenCurrencyCodeAndNumber } from '../../src/number/utils/normalize-format-number-to-parts/forceSpaceBetweenCurrencyCodeAndNumber.js';
import { forceSpaceInsteadOfZeroForGroup } from '../../src/number/utils/normalize-format-number-to-parts/forceSpaceInsteadOfZeroForGroup.js';

/**
 * @typedef {import('../../types/LocalizeMixinTypes.js').FormatNumberPart} FormatNumberPart
 * @param {FormatNumberPart[]} parts
 */
const join = parts => parts.map(p => p.value).join('');

/**
 * @param {string} integer
 * @returns {FormatNumberPart[]}
 */
const integerParts = integer => [
  { type: 'currency', value: 'EUR' },
  { type: 'literal', value: ' ' },
  { type: 'integer', value: integer },
  { type: 'decimal', value: '.' },
  { type: 'fraction', value: '00' },
];

describe('normalize-format-number-to-parts', () => {
  describe('forceAddGroupSeparators', () => {
    it('groups integers of more than three digits per three digits', () => {
      expect(join(forceAddGroupSeparators(integerParts('1234'), ' '))).to.equal('EUR 1 234.00');
      expect(join(forceAddGroupSeparators(integerParts('123456'), ' '))).to.equal('EUR 123 456.00');
      expect(join(forceAddGroupSeparators(integerParts('1234567'), ' '))).to.equal(
        'EUR 1 234 567.00',
      );
      expect(join(forceAddGroupSeparators(integerParts('123456789'), ' '))).to.equal(
        'EUR 123 456 789.00',
      );
    });

    it('returns the parts unchanged when no integer needs grouping', () => {
      const parts = integerParts('123');
      expect(forceAddGroupSeparators(parts, ' ')).to.equal(parts);
      expect(join(parts)).to.equal('EUR 123.00');
    });
  });

  describe('forceSpaceBetweenCurrencyCodeAndNumber', () => {
    /** @type {import('../../types/LocalizeMixinTypes.js').FormatNumberOptions} */
    const options = { currency: 'EUR', currencyDisplay: 'code' };

    it('adds a space between a leading currency code and the number', () => {
      /** @type {FormatNumberPart[]} */
      const parts = [
        { type: 'currency', value: 'EUR' },
        { type: 'integer', value: '1' },
      ];
      expect(join(forceSpaceBetweenCurrencyCodeAndNumber(parts, options))).to.equal('EUR 1');
    });

    it('adds a space between a currency code after a minus sign and the number', () => {
      /** @type {FormatNumberPart[]} */
      const parts = [
        { type: 'minusSign', value: '-' },
        { type: 'currency', value: 'EUR' },
        { type: 'integer', value: '1' },
      ];
      expect(join(forceSpaceBetweenCurrencyCodeAndNumber(parts, options))).to.equal('-EUR 1');
    });

    it('adds a space between the number and a trailing currency code', () => {
      /** @type {FormatNumberPart[]} */
      const parts = [
        { type: 'integer', value: '1' },
        { type: 'currency', value: 'EUR' },
      ];
      expect(join(forceSpaceBetweenCurrencyCodeAndNumber(parts, options))).to.equal('1 EUR');
    });

    it('leaves parts alone when a literal already separates currency and number', () => {
      /** @type {FormatNumberPart[]} */
      const parts = [
        { type: 'integer', value: '1' },
        { type: 'literal', value: ' ' },
        { type: 'currency', value: 'EUR' },
      ];
      expect(join(forceSpaceBetweenCurrencyCodeAndNumber(parts, options))).to.equal('1 EUR');
    });
  });

  describe('forceSpaceInsteadOfZeroForGroup', () => {
    it('replaces a "0" group separator by a space', () => {
      /** @type {FormatNumberPart[]} */
      const parts = [
        { type: 'integer', value: '1' },
        { type: 'group', value: '0' },
        { type: 'integer', value: '234' },
      ];
      expect(join(forceSpaceInsteadOfZeroForGroup(parts))).to.equal('1 234');
    });
  });
});
