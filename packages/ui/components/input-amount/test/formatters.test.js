import { expect } from '@open-wc/testing';
import { getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';
import { localizeTearDown } from '@lion/ui/localize-test-helpers.js';

import { formatAmount } from '@lion/ui/input-amount.js';

describe('formatAmount()', () => {
  const localizeManager = getLocalizeManager();

  afterEach(() => {
    localizeTearDown();
  });

  it('formats number with options', async () => {
    expect(
      formatAmount(12.345678, {
        locale: 'en-GB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    ).to.equal('12.35');
    expect(
      formatAmount(12.345678, {
        locale: 'nl-NL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    ).to.equal('12,35');
    expect(
      formatAmount(12345678, {
        locale: 'en-GB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    ).to.equal('12,345,678.00');
    expect(
      formatAmount(12345678, {
        locale: 'nl-NL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    ).to.equal('12.345.678,00');
    expect(
      formatAmount(12.345678, {
        locale: 'en-GB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      }),
    ).to.equal('12.3');
    expect(
      formatAmount(12.345678, {
        locale: 'en-GB',
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }),
    ).to.equal('12.346');
    expect(
      formatAmount(-12.345678, {
        locale: 'en-GB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    ).to.equal('−12.35');
  });

  it('formats the right amount of fraction digits for a certain currency', async () => {
    expect(formatAmount(123456.78, { locale: 'en-GB', currency: 'EUR' })).to.equal('123,456.78');
    expect(formatAmount(123456.78, { locale: 'en-GB', currency: 'JOD' })).to.equal('123,456.780');
  });

  it('fallbacks to global locale and EUR by default', async () => {
    localizeManager.locale = 'en-GB';
    expect(formatAmount(12345678)).to.equal('12,345,678.00');
    localizeManager.locale = 'nl-NL';
    expect(formatAmount(12345678)).to.equal('12.345.678,00');
  });

  // TODO: make it work with big numbers, e.g. make use of BigInt
  it.skip('rounds up big numbers', async () => {
    expect(formatAmount(1e21, { locale: 'en-GB', currency: 'EUR' })).to.equal(
      '1,000,000,000,000,000,000,000.00',
    );
    // eslint-disable-next-line no-loss-of-precision
    expect(formatAmount(12345678987654321.42, { locale: 'en-GB', currency: 'EUR' })).to.equal(
      '12,345,678,987,654,321.42',
    );
  });

  // Ensures formatter uses a normal dash (-) instead of unicode minus (\u2212)
  it('does not return unicode minus sign in formatted output', async () => {
    const result = formatAmount(-123.45, {
      locale: 'en-GB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    expect(result).to.equal('-123.45'); // Should be a normal dash
  });
});
