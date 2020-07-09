import { expect } from '@open-wc/testing';

import {
  IsNumber,
  MinNumber,
  MaxNumber,
  MinMaxNumber,
} from '../../src/validate/validators/NumberValidators.js';

describe('Number Validation', () => {
  it('provides new IsNumber() to allow only numbers', () => {
    let isEnabled;
    const validator = new IsNumber();
    expect(validator.constructor.validatorName).to.equal('IsNumber');

    isEnabled = validator.execute(4);
    expect(isEnabled).to.be.false;

    isEnabled = validator.execute(NaN);
    expect(isEnabled).to.be.true;

    isEnabled = validator.execute('4');
    expect(isEnabled).to.be.true;
  });

  it('provides new MinNumber(x) to allow only numbers longer then min', () => {
    let isEnabled;
    const validator = new MinNumber(3);
    expect(validator.constructor.validatorName).to.equal('MinNumber');

    isEnabled = validator.execute(3);
    expect(isEnabled).to.be.false;

    isEnabled = validator.execute(2);
    expect(isEnabled).to.be.true;
  });

  it('provides new MaxNumber(x) to allow only number shorter then max', () => {
    let isEnabled;
    const validator = new MaxNumber(3);
    expect(validator.constructor.validatorName).to.equal('MaxNumber');

    isEnabled = validator.execute(3);
    expect(isEnabled).to.be.false;

    isEnabled = validator.execute(4);
    expect(isEnabled).to.be.true;
  });

  it('provides new MinMaxNumber({ min: x, max: y}) to allow only numbers between min and max', () => {
    let isEnabled;
    const validator = new MinMaxNumber({ min: 2, max: 4 });
    expect(validator.constructor.validatorName).to.equal('MinMaxNumber');

    isEnabled = validator.execute(2);
    expect(isEnabled).to.be.false;
    isEnabled = validator.execute(4);
    expect(isEnabled).to.be.false;

    isEnabled = validator.execute(1);
    expect(isEnabled).to.be.true;

    isEnabled = validator.execute(5);
    expect(isEnabled).to.be.true;
  });
});
