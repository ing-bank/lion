import { expect } from '@open-wc/testing';
import { getLocalizeManager, parseNumber } from '@lion/ui/localize-no-side-effects.js';

describe('parseNumber()', () => {
  const localizeManager = getLocalizeManager();

  it('parses integers', () => {
    expect(parseNumber('1')).to.equal(1);
    expect(parseNumber('12')).to.equal(12);
    expect(parseNumber('123')).to.equal(123);
    expect(parseNumber('1234')).to.equal(1234);
    expect(parseNumber('12345')).to.equal(12345);
    expect(parseNumber('123456')).to.equal(123456);
    expect(parseNumber('1234567')).to.equal(1234567);
    expect(parseNumber('12345678')).to.equal(12345678);
    expect(parseNumber('123456789')).to.equal(123456789);
  });

  it('detects separators heuristically when there are 2 different ones e.g. 1,234.5', () => {
    expect(parseNumber('1,234.5')).to.equal(1234.5);
    expect(parseNumber('1.234,5')).to.equal(1234.5);
    expect(parseNumber('1 234.5')).to.equal(1234.5);
    expect(parseNumber('1 234,5')).to.equal(1234.5);

    expect(parseNumber('1,234.56')).to.equal(1234.56);
    expect(parseNumber('1.234,56')).to.equal(1234.56);
    expect(parseNumber('1 234.56')).to.equal(1234.56);
    expect(parseNumber('1 234,56')).to.equal(1234.56);

    expect(parseNumber('1,234.567')).to.equal(1234.567);
    expect(parseNumber('1.234,567')).to.equal(1234.567);
    expect(parseNumber('1 234.567')).to.equal(1234.567);
    expect(parseNumber('1 234,567')).to.equal(1234.567);

    expect(parseNumber('1,234.5678')).to.equal(1234.5678);
    expect(parseNumber('1.234,5678')).to.equal(1234.5678);
    expect(parseNumber('1 234.5678')).to.equal(1234.5678);
    expect(parseNumber('1 234,5678')).to.equal(1234.5678);

    expect(parseNumber('1,234.56789')).to.equal(1234.56789);
    expect(parseNumber('1.234,56789')).to.equal(1234.56789);
    expect(parseNumber('1 234.56789')).to.equal(1234.56789);
    expect(parseNumber('1 234,56789')).to.equal(1234.56789);
  });

  it('detects separators heuristically when there is only one and "pasted" mode used e.g. 123456,78', () => {
    expect(parseNumber('1.', { mode: 'pasted' })).to.equal(1);
    expect(parseNumber('1,', { mode: 'pasted' })).to.equal(1);
    expect(parseNumber('1 ', { mode: 'pasted' })).to.equal(1);

    expect(parseNumber('1.2', { mode: 'pasted' })).to.equal(1.2);
    expect(parseNumber('1,2', { mode: 'pasted' })).to.equal(1.2);
    expect(parseNumber('1 2', { mode: 'pasted' })).to.equal(12);

    expect(parseNumber('1.23', { mode: 'pasted' })).to.equal(1.23);
    expect(parseNumber('1,23', { mode: 'pasted' })).to.equal(1.23);
    expect(parseNumber('1 23', { mode: 'pasted' })).to.equal(123);

    expect(parseNumber('1 234', { mode: 'pasted' })).to.equal(1234);

    expect(parseNumber('1.2345', { mode: 'pasted' })).to.equal(1.2345);
    expect(parseNumber('1,2345', { mode: 'pasted' })).to.equal(1.2345);
    expect(parseNumber('1 2345', { mode: 'pasted' })).to.equal(12345);

    expect(parseNumber('1.23456', { mode: 'pasted' })).to.equal(1.23456);
    expect(parseNumber('1,23456', { mode: 'pasted' })).to.equal(1.23456);
    expect(parseNumber('1 23456', { mode: 'pasted' })).to.equal(123456);

    expect(parseNumber('1.234567', { mode: 'pasted' })).to.equal(1.234567);
    expect(parseNumber('1,234567', { mode: 'pasted' })).to.equal(1.234567);
    expect(parseNumber('1 234567', { mode: 'pasted' })).to.equal(1234567);

    expect(parseNumber('123456,78', { mode: 'pasted' })).to.equal(123456.78);
    expect(parseNumber('123456.78', { mode: 'pasted' })).to.equal(123456.78);
  });

  it('detects separators unparseable when there are 2 same ones e.g. 1.234.56', () => {
    expect(parseNumber('1.234.56')).to.equal(123456);
    expect(parseNumber('1,234,56')).to.equal(123456);
    expect(parseNumber('1 234 56')).to.equal(123456);
  });

  it('uses heuristic to parse amount if there is only one separator e.g. 12.34 and amount of decimals is 2 or smaller', () => {
    localizeManager.locale = 'en-GB';
    expect(parseNumber('12.3')).to.equal(12.3);
    expect(parseNumber('12,3')).to.equal(12.3);
    expect(parseNumber('12.34')).to.equal(12.34);
    expect(parseNumber('12,34')).to.equal(12.34);

    localizeManager.locale = 'nl-NL';
    expect(parseNumber('12.3')).to.equal(12.3);
    expect(parseNumber('12,3')).to.equal(12.3);
    expect(parseNumber('12.34')).to.equal(12.34);
    expect(parseNumber('12,34')).to.equal(12.34);
  });

  it('uses locale to parse amount if there is only one separator e.g. 1.234 and amount of decimals is bigger then 2', () => {
    localizeManager.locale = 'en-GB';
    expect(parseNumber('1.234')).to.equal(1.234);
    expect(parseNumber('1,234')).to.equal(1234);
    expect(parseNumber('1.2345')).to.equal(1.2345);
    expect(parseNumber('1,2345')).to.equal(12345);

    localizeManager.locale = 'nl-NL';
    expect(parseNumber('1.234')).to.equal(1234);
    expect(parseNumber('1,234')).to.equal(1.234);
    expect(parseNumber('1.2345')).to.equal(12345);
    expect(parseNumber('1,2345')).to.equal(1.2345);
  });

  it('returns numbers only if it can not be interpreted e.g. 1.234.567', () => {
    // impossible to interpret unambiguously even with locale knowledge
    expect(parseNumber('1.234.567')).to.equal(1234567);
    expect(parseNumber('1,234,567')).to.equal(1234567);
  });

  it('keeps only last separator for "broken" numbers like 1.23,4', () => {
    expect(parseNumber('1.23,4')).to.equal(123.4);
    expect(parseNumber('1,23.4')).to.equal(123.4);
    expect(parseNumber('1 23,4')).to.equal(123.4);
    expect(parseNumber('1 23.4')).to.equal(123.4);
  });

  it('ignores all non-number symbols (including currency)', () => {
    expect(parseNumber('€ 1,234.56')).to.equal(1234.56);
    expect(parseNumber('1,234.56 €')).to.equal(1234.56);
    expect(parseNumber('EUR 1,234.56')).to.equal(1234.56);
    expect(parseNumber('1,234.56 EUR')).to.equal(1234.56);
    expect(parseNumber('Number is 1,234.56')).to.equal(1234.56);
  });

  describe('negative numbers', () => {
    it('can get parsed', () => {
      expect(parseNumber('-0')).to.equal(0);
      expect(parseNumber('-1')).to.equal(-1);
      expect(parseNumber('-1234')).to.equal(-1234);
      expect(parseNumber('-1.234,5')).to.equal(-1234.5);
      expect(parseNumber('-1,234.5')).to.equal(-1234.5);
      expect(parseNumber('-1.234,5678')).to.equal(-1234.5678);
      expect(parseNumber('-1,234.5678')).to.equal(-1234.5678);
    });

    it('parses different type of hypens', () => {
      expect(parseNumber('-1')).to.equal(-1, 'Hypen');
      expect(parseNumber('−1')).to.equal(-1, 'Minus-Sign');
    });

    it('ignores all non-number symbols (including currency)', () => {
      expect(parseNumber('€ -1,234.56')).to.equal(-1234.56);
      expect(parseNumber('-€ 1,234.56')).to.equal(-1234.56);
      expect(parseNumber('-1,234.56 €')).to.equal(-1234.56);
      expect(parseNumber('EUR -1,234.56')).to.equal(-1234.56);
      expect(parseNumber('-EUR 1,234.56')).to.equal(-1234.56);
      expect(parseNumber('-1,234.56 EUR')).to.equal(-1234.56);
    });

    it('detects separators unparseable when there are 2 same ones e.g. -1.234.56', () => {
      expect(parseNumber('-1.234.56')).to.equal(-123456);
      expect(parseNumber('-1,234,56')).to.equal(-123456);
      expect(parseNumber('-1 234 56')).to.equal(-123456);
    });
  });

  it('ignores non-number characters and returns undefined', () => {
    expect(parseNumber('A')).to.equal(undefined);
    expect(parseNumber('EUR')).to.equal(undefined);
    expect(parseNumber('EU R')).to.equal(undefined);
  });

  it('returns undefined when value is empty string', () => {
    expect(parseNumber('')).to.equal(undefined);
  });

  it('with locale set and length is more than four', () => {
    expect(
      parseNumber('6,000', {
        locale: 'en-GB',
      }),
    ).to.equal(6000);
    expect(
      parseNumber('6.000', {
        locale: 'es-ES',
      }),
    ).to.equal(6000);
  });
});
