import { expect } from '@open-wc/testing';
import { localize } from '@lion/ui/localize.js';
import { parseAmount } from '@lion/ui/input-amount.js';

describe('parseAmount()', async () => {
  it('with currency set to correct amount of decimals', async () => {
    localize.locale = 'en-GB';
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
    localize.locale = 'en-GB';
    expect(parseAmount('1.015')).to.equal(1.015);
  });

  it('returns undefined if a invalid value is entered', async () => {
    localize.locale = 'en-GB';
    expect(parseAmount('foo')).to.equal(undefined);
    expect(parseAmount('foo1')).to.equal(undefined);
    expect(parseAmount('--1')).to.equal(undefined);
  });

  it('returns undefined if the value is too big', async () => {
    localize.locale = 'en-GB';
    expect(parseAmount('999999999999999999999,42')).to.equal(undefined);
  });
});
