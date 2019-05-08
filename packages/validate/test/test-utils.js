import { expect } from '@open-wc/testing';

export const smokeTestValidator = (name, validator, value, params = undefined) => {
  const generated = validator(params);
  expect(generated[0](value, params)[name]).to.be.true;
  if (params) {
    expect(generated[1]).to.equals(params);
  }
};
