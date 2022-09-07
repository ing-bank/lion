import { expect } from '@open-wc/testing';

import { getSeparators } from '../../src/number/getSeparators.js';

describe('getSeparators', () => {
  it('returns group separator for locale', () => {
    expect(getSeparators(99, '99.00')).to.eql({
      thousandSeparator: null,
      decimalSeparator: '.',
    });
    expect(getSeparators(1000, '1,000')).to.eql({
      thousandSeparator: ',',
      decimalSeparator: null,
    });
    expect(getSeparators(12345678901, '12,345,678.901')).to.eql({
      thousandSeparator: ',',
      decimalSeparator: '.',
    });
    expect(getSeparators(12345678901, '12_345_678_901')).to.eql({
      thousandSeparator: '_',
      decimalSeparator: null,
    });
    expect(getSeparators(123, '123,00 €')).to.eql({
      thousandSeparator: null,
      decimalSeparator: ',',
    });
    expect(getSeparators(123, '€123,00')).to.eql({
      thousandSeparator: null,
      decimalSeparator: ',',
    });
    expect(getSeparators(1234, '123.400 dollar')).to.eql({
      thousandSeparator: '.',
      decimalSeparator: null,
    });
    expect(getSeparators(1234.5, '1 234,50 €')).to.eql({
      thousandSeparator: ' ',
      decimalSeparator: ',',
    });
    expect(getSeparators(-1234, '-1,234')).to.eql({
      thousandSeparator: ',',
      decimalSeparator: null,
    });
    expect(getSeparators(123, '0,123', { minimumIntegerDigits: 4 })).to.eql({
      thousandSeparator: ',',
      decimalSeparator: null,
    });
  });
});
