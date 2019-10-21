import { expect } from '@open-wc/testing';
import { isValidatorApplied } from '../../src/isValidatorApplied.js';

describe('isValidatorApplied', () => {
  it(`checks if validator (provided name string) is applied`, async () => {
    const myValFn = (val, param) => ({ myValFn: param === 'x' });
    const myOtherValFn = (val, param) => ({ myOtherValFn: param === 'x' });

    expect(isValidatorApplied('myValFn', myValFn, 'x')).to.equal(true);
    expect(isValidatorApplied('myValFn', myValFn, 'y')).to.equal(true);

    expect(isValidatorApplied('myValFn', myOtherValFn, 'x')).to.equal(false);
    expect(isValidatorApplied('myValFn', myOtherValFn, 'y')).to.equal(false);
  });
});
