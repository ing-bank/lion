import { expect } from '@open-wc/testing';
import { localize } from '@lion/localize';

import { parseAmount } from '../src/parsers.js';

describe('parseAmount()', () => {
  it('parses integers', () => {
    expect(parseAmount('1')).to.equal(1);
    expect(parseAmount('12')).to.equal(12);
    expect(parseAmount('123')).to.equal(123);
    expect(parseAmount('1234')).to.equal(1234);
    expect(parseAmount('12345')).to.equal(12345);
    expect(parseAmount('123456')).to.equal(123456);
    expect(parseAmount('1234567')).to.equal(1234567);
    expect(parseAmount('12345678')).to.equal(12345678);
    expect(parseAmount('123456789')).to.equal(123456789);
  });

  it('detects separators heuristically when there are 2 different ones e.g. 1,234.5', () => {
    expect(parseAmount('1,234.5')).to.equal(1234.5);
    expect(parseAmount('1.234,5')).to.equal(1234.5);
    expect(parseAmount('1 234.5')).to.equal(1234.5);
    expect(parseAmount('1 234,5')).to.equal(1234.5);

    expect(parseAmount('1,234.56')).to.equal(1234.56);
    expect(parseAmount('1.234,56')).to.equal(1234.56);
    expect(parseAmount('1 234.56')).to.equal(1234.56);
    expect(parseAmount('1 234,56')).to.equal(1234.56);

    expect(parseAmount('1,234.567')).to.equal(1234.567);
    expect(parseAmount('1.234,567')).to.equal(1234.567);
    expect(parseAmount('1 234.567')).to.equal(1234.567);
    expect(parseAmount('1 234,567')).to.equal(1234.567);

    expect(parseAmount('1,234.5678')).to.equal(1234.5678);
    expect(parseAmount('1.234,5678')).to.equal(1234.5678);
    expect(parseAmount('1 234.5678')).to.equal(1234.5678);
    expect(parseAmount('1 234,5678')).to.equal(1234.5678);

    expect(parseAmount('1,234.56789')).to.equal(1234.56789);
    expect(parseAmount('1.234,56789')).to.equal(1234.56789);
    expect(parseAmount('1 234.56789')).to.equal(1234.56789);
    expect(parseAmount('1 234,56789')).to.equal(1234.56789);
  });

  it('detects separators heuristically when there is only one and "pasted" mode used e.g. 123456,78', () => {
    expect(parseAmount('1.', { mode: 'pasted' })).to.equal(1);
    expect(parseAmount('1,', { mode: 'pasted' })).to.equal(1);
    expect(parseAmount('1 ', { mode: 'pasted' })).to.equal(1);

    expect(parseAmount('1.2', { mode: 'pasted' })).to.equal(1.2);
    expect(parseAmount('1,2', { mode: 'pasted' })).to.equal(1.2);
    expect(parseAmount('1 2', { mode: 'pasted' })).to.equal(12);

    expect(parseAmount('1.23', { mode: 'pasted' })).to.equal(1.23);
    expect(parseAmount('1,23', { mode: 'pasted' })).to.equal(1.23);
    expect(parseAmount('1 23', { mode: 'pasted' })).to.equal(123);

    expect(parseAmount('1 234', { mode: 'pasted' })).to.equal(1234);

    expect(parseAmount('1.2345', { mode: 'pasted' })).to.equal(1.2345);
    expect(parseAmount('1,2345', { mode: 'pasted' })).to.equal(1.2345);
    expect(parseAmount('1 2345', { mode: 'pasted' })).to.equal(12345);

    expect(parseAmount('1.23456', { mode: 'pasted' })).to.equal(1.23456);
    expect(parseAmount('1,23456', { mode: 'pasted' })).to.equal(1.23456);
    expect(parseAmount('1 23456', { mode: 'pasted' })).to.equal(123456);

    expect(parseAmount('1.234567', { mode: 'pasted' })).to.equal(1.234567);
    expect(parseAmount('1,234567', { mode: 'pasted' })).to.equal(1.234567);
    expect(parseAmount('1 234567', { mode: 'pasted' })).to.equal(1234567);

    expect(parseAmount('123456,78', { mode: 'pasted' })).to.equal(123456.78);
    expect(parseAmount('123456.78', { mode: 'pasted' })).to.equal(123456.78);
  });

  it('detects separators heuristically when there are 2 same ones e.g. 1.234.56', () => {
    expect(parseAmount('1.234.5')).to.equal(1234.5);
    expect(parseAmount('1,234,5')).to.equal(1234.5);

    expect(parseAmount('1.234.56')).to.equal(1234.56);
    expect(parseAmount('1,234,56')).to.equal(1234.56);
    expect(parseAmount('1 234 56')).to.equal(123456);

    expect(parseAmount('1.234.5678')).to.equal(1234.5678);
    expect(parseAmount('1,234,5678')).to.equal(1234.5678);

    expect(parseAmount('1.234.56789')).to.equal(1234.56789);
    expect(parseAmount('1,234,56789')).to.equal(1234.56789);
  });

  it('uses locale to parse amount if there is only one separator e.g. 1.234', () => {
    localize.locale = 'en-GB';
    expect(parseAmount('12.34')).to.equal(12.34);
    expect(parseAmount('12,34')).to.equal(1234);
    expect(parseAmount('1.234')).to.equal(1.234);
    expect(parseAmount('1,234')).to.equal(1234);

    localize.locale = 'nl-NL';
    expect(parseAmount('12.34')).to.equal(1234);
    expect(parseAmount('12,34')).to.equal(12.34);
    expect(parseAmount('1.234')).to.equal(1234);
    expect(parseAmount('1,234')).to.equal(1.234);
  });

  it('returns numbers only if it can not be interpreted e.g. 1.234.567', () => {
    // impossible to interpret unambiguously even with locale knowledge
    expect(parseAmount('1.234.567')).to.equal(1234567);
    expect(parseAmount('1,234,567')).to.equal(1234567);
  });

  it('keeps only last separator for "broken" numbers like 1.23,4', () => {
    expect(parseAmount('1.23,4')).to.equal(123.4);
    expect(parseAmount('1,23.4')).to.equal(123.4);
    expect(parseAmount('1 23,4')).to.equal(123.4);
    expect(parseAmount('1 23.4')).to.equal(123.4);
  });

  it('parses negative numbers', () => {
    expect(parseAmount('-0')).to.equal(0);
    expect(parseAmount('-1')).to.equal(-1);
    expect(parseAmount('-1234')).to.equal(-1234);
    expect(parseAmount('-1.234,5')).to.equal(-1234.5);
    expect(parseAmount('-1,234.5')).to.equal(-1234.5);
    expect(parseAmount('-1.234,5678')).to.equal(-1234.5678);
    expect(parseAmount('-1,234.5678')).to.equal(-1234.5678);
  });

  it('ignores all non-number symbols (including currency)', () => {
    expect(parseAmount('€ 1,234.56')).to.equal(1234.56);
    expect(parseAmount('€ -1,234.56')).to.equal(-1234.56);
    expect(parseAmount('-€ 1,234.56')).to.equal(-1234.56);
    expect(parseAmount('1,234.56 €')).to.equal(1234.56);
    expect(parseAmount('-1,234.56 €')).to.equal(-1234.56);
    expect(parseAmount('EUR 1,234.56')).to.equal(1234.56);
    expect(parseAmount('EUR -1,234.56')).to.equal(-1234.56);
    expect(parseAmount('-EUR 1,234.56')).to.equal(-1234.56);
    expect(parseAmount('1,234.56 EUR')).to.equal(1234.56);
    expect(parseAmount('-1,234.56 EUR')).to.equal(-1234.56);
    expect(parseAmount('Number is 1,234.56')).to.equal(1234.56);
  });

  it('ignores non-number characters and returns undefined', () => {
    expect(parseAmount('A')).to.equal(undefined);
    expect(parseAmount('EUR')).to.equal(undefined);
    expect(parseAmount('EU R')).to.equal(undefined);
  });

  it('returns undefined when value is empty string', () => {
    expect(parseAmount('')).to.equal(undefined);
  });

  it('parseAmount with locale set and length is more than four', () => {
    expect(
      parseAmount('6,000', {
        locale: 'gb-GB',
      }),
    ).to.equal(6000);
    expect(
      parseAmount('6.000', {
        locale: 'es-ES',
      }),
    ).to.equal(6000);
  });
});
