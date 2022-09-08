import { expect } from '@open-wc/testing';

import { getSeparatorsFromNumber } from '../../src/number/getSeparatorsFromNumber.js';

describe('getSeparatorsFromNumber', () => {
  it('returns group separator for locale', () => {
    expect(getSeparatorsFromNumber(99, '99.00')).to.eql({
      groupSeparator: null,
      decimalSeparator: '.',
    });
    expect(getSeparatorsFromNumber(1000, '1,000')).to.eql({
      groupSeparator: ',',
      decimalSeparator: null,
    });
    expect(getSeparatorsFromNumber(12345678901, '12,345,678.901')).to.eql({
      groupSeparator: ',',
      decimalSeparator: '.',
    });
    expect(getSeparatorsFromNumber(12345678901, '12_345_678_901')).to.eql({
      groupSeparator: '_',
      decimalSeparator: null,
    });
    expect(getSeparatorsFromNumber(123, '123,00 €')).to.eql({
      groupSeparator: null,
      decimalSeparator: ',',
    });
    expect(getSeparatorsFromNumber(123, '€123,00')).to.eql({
      groupSeparator: null,
      decimalSeparator: ',',
    });
    expect(getSeparatorsFromNumber(1234, '123.400 dollar')).to.eql({
      groupSeparator: '.',
      decimalSeparator: null,
    });
    expect(getSeparatorsFromNumber(1234.5, '1 234,50 €')).to.eql({
      groupSeparator: ' ',
      decimalSeparator: ',',
    });
    expect(getSeparatorsFromNumber(-1234, '-1,234')).to.eql({
      groupSeparator: ',',
      decimalSeparator: null,
    });
    expect(getSeparatorsFromNumber(123, '0,123', { minimumIntegerDigits: 4 })).to.eql({
      groupSeparator: ',',
      decimalSeparator: null,
    });
  });
});
