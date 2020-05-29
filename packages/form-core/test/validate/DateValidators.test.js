import { expect } from '@open-wc/testing';

import { normalizeDateTime } from '@lion/localize';
import {
  IsDate,
  MinDate,
  MaxDate,
  MinMaxDate,
  IsDateDisabled,
} from '../../src/validate/validators/DateValidators.js';

describe('Date Validation', () => {
  it('provides new isDate() to allow only dates', () => {
    let isEnabled;
    const validator = new IsDate();
    expect(validator.constructor.name).to.equal('IsDate');

    isEnabled = validator.execute(new Date());
    expect(isEnabled).to.be.false;

    isEnabled = validator.execute('foo');
    expect(isEnabled).to.be.true;

    isEnabled = validator.execute(4);
    expect(isEnabled).to.be.true;
  });

  it('provides new minDate(x) to allow only dates after min', () => {
    let isEnabled;
    const validator = new MinDate(new Date('2018/02/02'));
    expect(validator.constructor.name).to.equal('MinDate');

    isEnabled = validator.execute(new Date('2018-02-03'));
    expect(isEnabled).to.be.false;

    isEnabled = validator.execute(new Date('2018-02-01'));
    expect(isEnabled).to.be.true;

    const today = new Date();
    const todayFormatted = normalizeDateTime(today);
    const todayValidator = new MinDate(today);
    isEnabled = todayValidator.execute(todayFormatted);
    expect(isEnabled).to.be.false;
  });

  it('provides maxDate() to allow only dates before max', () => {
    let isEnabled;
    const validator = new MaxDate(new Date('2018/02/02'));
    expect(validator.constructor.name).to.equal('MaxDate');

    isEnabled = validator.execute(new Date('2018-02-01'));
    expect(isEnabled).to.be.false;

    isEnabled = validator.execute(new Date('2018-02-03'));
    expect(isEnabled).to.be.true;

    const today = new Date();
    const todayFormatted = normalizeDateTime(today);
    const todayValidator = new MaxDate(today);
    isEnabled = todayValidator.execute(todayFormatted);
    expect(isEnabled).to.be.false;
  });

  it('provides new MinMaxDate() to allow only dates between min and max', () => {
    let isEnabled;
    const validator = new MinMaxDate({
      min: new Date('2018/02/02'),
      max: new Date('2018/02/04'),
    });
    expect(validator.constructor.name).to.equal('MinMaxDate');

    isEnabled = validator.execute(new Date('2018/02/03'));
    expect(isEnabled).to.be.false;

    isEnabled = validator.execute(new Date('2018/02/01'));
    expect(isEnabled).to.be.true;

    isEnabled = validator.execute(new Date('2018/02/05'));
    expect(isEnabled).to.be.true;

    const today = new Date();
    const todayFormatted = normalizeDateTime(today);
    const todayValidator = new MinMaxDate({ min: today, max: today });
    isEnabled = todayValidator.execute(todayFormatted);
    expect(isEnabled).to.be.false;
  });

  it('provides new IsDateDisabled() to disable dates matching specified condition', () => {
    let isDisabled;
    const validator = new IsDateDisabled(d => d.getDate() === 3);
    expect(validator.constructor.name).to.equal('IsDateDisabled');

    isDisabled = validator.execute(new Date('2018/02/04'));
    expect(isDisabled).to.be.false;

    isDisabled = validator.execute(new Date('2018/02/03'));
    expect(isDisabled).to.be.true;
  });
});
