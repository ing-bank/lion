import { expect } from '@open-wc/testing';
import { getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';
import { localizeTearDown } from '@lion/ui/localize-test-helpers.js';
import { parseAmount } from '@lion/ui/input-amount.js';

describe('parseAmount()', async () => {
  const localizeManager = getLocalizeManager();

  beforeEach(() => {
    localizeManager.locale = 'en-GB';
  });

  afterEach(() => {
    localizeTearDown();
  });

  it('with currency set to correct amount of decimals', async () => {
    expect(
      parseAmount('1.015', {
        currency: 'EUR',
      }),
    ).to.equal(1.02);
    expect(
      parseAmount('5.555', {
        currency: 'EUR',
      }),
    ).to.equal(5.56);
    expect(
      parseAmount('100.1235', {
        currency: 'JPY',
      }),
    ).to.equal(100);
    expect(
      parseAmount('100.1235', {
        currency: 'JOD',
      }),
    ).to.equal(100.124);
  });

  it('with no currency keeps all decimals', async () => {
    expect(parseAmount('1.015')).to.equal(1.015);
  });

  // TODO: make it work with big numbers, e.g. make use of BigInt
  it.skip('rounds up big numbers', async () => {
    // eslint-disable-next-line no-loss-of-precision
    expect(parseAmount('999999999999999999999,42')).to.equal(999999999999999999999.42);
    // eslint-disable-next-line no-loss-of-precision
    expect(parseAmount('12,345,678,987,654,321.42')).to.equal(12345678987654321.42);
  });

  it('returns undefined if an invalid value is entered', async () => {
    expect(parseAmount('foo')).to.equal(undefined);
    expect(parseAmount('foo1')).to.equal(undefined);
    expect(parseAmount('EUR 1,50')).to.equal(undefined);
    expect(parseAmount('--1')).to.equal(undefined);
  });

  it('ignores letters when "pasted" mode used', async () => {
    expect(parseAmount('foo1', { mode: 'pasted' })).to.equal(1);
    expect(parseAmount('EUR 1,50', { mode: 'pasted' })).to.equal(1.5);
  });

  it('parses based on locale when "user-edited" mode used combined with viewValueStates "formatted"', async () => {
    expect(parseAmount('123,456.78', { mode: 'auto' })).to.equal(123456.78);
    expect(
      parseAmount('123,456.78', { mode: 'user-edited', viewValueStates: ['formatted'] }),
    ).to.equal(123456.78);
    expect(parseAmount('123.456,78', { mode: 'auto' })).to.equal(123456.78);
    expect(
      parseAmount('123.456,78', { mode: 'user-edited', viewValueStates: ['formatted'] }),
    ).to.equal(123456.78);
  });
});
