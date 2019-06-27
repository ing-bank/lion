import { expect } from '@open-wc/testing';

import { getFractionDigits } from '../../src/number/getFractionDigits.js';

describe('getFractionDigits', () => {
  it('returns number of fraction digits for currency', () => {
    expect(getFractionDigits('JPY')).to.equal(0);
    expect(getFractionDigits('EUR')).to.equal(2);
    expect(getFractionDigits('BHD')).to.equal(3);
  });
});
