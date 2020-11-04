import { expect } from '@open-wc/testing';
import { isSameDate } from '../../src/utils/isSameDate.js';

describe('isSameDate', () => {
  it('returns true if the same date is given', () => {
    const day1 = new Date('2001/01/01');
    const day2 = new Date('2001/01/01');
    const day3 = new Date('2002/02/02');
    expect(isSameDate(day1, day2)).to.be.true;
    expect(isSameDate(day1, day3)).to.be.false;
  });
});
