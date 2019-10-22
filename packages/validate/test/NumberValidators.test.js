import { expect } from '@open-wc/testing';

import {
  IsNumber,
  MinNumber,
  MaxNumber,
  MinMaxNumber,
} from '../src/validators/NumberValidators.js';

describe('Number Validation', () => {
  it('provides new IsNumber() to allow only numbers', () => {
    let isEnabled;
    const validator = new IsNumber();

    isEnabled = validator.execute(4);
    expect(validator.execute(4)).to.be.false;

    isEnabled = validator.execute(NaN);
    expect(validator.execute(NaN)).to.be.true;

    isEnabled = validator.execute('4');
    expect(isEnabled).to.be.true;
  });

  it('provides new MinNumber() to allow only numbers longer then min', () => {
    let isEnabled;
    const validator = new MinNumber(3);

    isEnabled = validator.execute(3);
    expect(isEnabled).to.be.false;

    isEnabled = validator.execute(2);
    expect(isEnabled).to.be.true;
  });

  it('provides new MaxNumber() to allow only number shorter then max', () => {
    let isEnabled;
    const validator = new MaxNumber(3);

    isEnabled = validator.execute(3);
    expect(isEnabled).to.be.false;

    isEnabled = validator.execute(4);
    expect(isEnabled).to.be.true;
  });

  it('provides new MinMaxNumber() to allow only numbers between min and max', () => {
    let isEnabled;
    const validator = new MinMaxNumber({ min: 2, max: 4 });

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
