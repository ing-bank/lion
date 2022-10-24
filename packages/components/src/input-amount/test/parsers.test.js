import { expect } from '@open-wc/testing';
import { localize } from '@lion/components/localize.js';

import { parseAmount } from '@lion/components/input-amount.js';

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
});
