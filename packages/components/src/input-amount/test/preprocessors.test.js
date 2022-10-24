import { expect } from '@open-wc/testing';

import { preprocessAmount } from '@lion/components/input-amount.js';

describe('preprocessAmount()', () => {
  it('preprocesses numbers to filter out non-digits', async () => {
    expect(preprocessAmount('123as@dh2^!#')).to.equal('1232');
  });

  it('does not filter out separator characters', async () => {
    expect(preprocessAmount('123 456,78.90')).to.equal(
      '123 456,78.90',
      'Dot, comma and space should not be filtered out.',
    );
  });
});
