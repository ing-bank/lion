import { expect } from '@open-wc/testing';
import { localize } from '@lion/localize';

import { formatAmount } from '../src/formatters.js';

describe('formatAmount()', () => {
  it('formats number for specific locale', async () => {
    localize.locale = 'en-GB';
    expect(formatAmount(12345678)).to.equal('12,345,678.00');
    expect(formatAmount(12.345678)).to.equal('12.35');
    // TODO: Document that maximumFractionDigits >= minimumFractionDigits else a RangeError is thrown by Intl
    expect(
      formatAmount(12.345678, { minimumFractionDigits: 0, maximumFractionDigits: 1 }),
    ).to.equal('12.3');
    expect(
      formatAmount(12.345678, { minimumFractionDigits: 3, maximumFractionDigits: 3 }),
    ).to.equal('12.346');

    localize.locale = 'nl-NL';
    expect(formatAmount(12345678)).to.equal('12.345.678,00');
    expect(formatAmount(12345678, { locale: 'nl-NL' })).to.equal('12.345.678,00');
    expect(formatAmount(123456.78, { locale: 'nl-NL' })).to.equal('123.456,78');
    expect(formatAmount(123456.78, { locale: 'nl-NL', currency: 'JOD' })).to.equal('123.456,780');
  });
});
