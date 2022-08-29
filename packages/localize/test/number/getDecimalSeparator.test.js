import { expect } from '@open-wc/testing';

import { getDecimalSeparator } from '../../src/number/getDecimalSeparator.js';

describe('getDecimalSeparator', () => {
  it('returns decimal separator for locale', () => {
    expect(getDecimalSeparator('en-GB')).to.equal('.');
    expect(getDecimalSeparator('nl-NL')).to.equal(',');
    expect(getDecimalSeparator('fr-FR')).to.equal(',');
  });

  it('will return the decimalSeparator from options if passed', () => {
    expect(getDecimalSeparator('nl-NL')).to.equal(',');
    expect(getDecimalSeparator('nl-NL', { decimalSeparator: '.' })).to.equal('.');
  });
});
