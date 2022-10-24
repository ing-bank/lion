import { expect } from '@open-wc/testing';
import { isSameDate } from '@lion/components/calendar.js';
import { getFirstDayNextMonth } from '../../utils/getFirstDayNextMonth.js';

describe('getFirstDayNextMonth', () => {
  it('returns the first day of the next month', () => {
    expect(
      isSameDate(getFirstDayNextMonth(new Date('2001/01/01')), new Date('2001/02/01')),
    ).to.equal(true);
    expect(
      isSameDate(getFirstDayNextMonth(new Date('2001/10/10')), new Date('2001/11/01')),
    ).to.equal(true);
    expect(
      isSameDate(getFirstDayNextMonth(new Date('2000/03/10')), new Date('2000/04/01')),
    ).to.equal(true);
  });
});
