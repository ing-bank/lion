import { expect } from '@open-wc/testing';
import { isSameDate } from '@lion/ui/calendar.js';
import { getLastDayPreviousMonth } from '../../src/utils/getLastDayPreviousMonth.js';

describe('getLastDayPreviousMonth', () => {
  it('returns the last day of the previous month', () => {
    expect(
      isSameDate(getLastDayPreviousMonth(new Date('2001/01/01')), new Date('2000/12/31')),
    ).to.equal(true);
    expect(
      isSameDate(getLastDayPreviousMonth(new Date('2001/10/10')), new Date('2001/09/30')),
    ).to.equal(true);
    expect(
      isSameDate(getLastDayPreviousMonth(new Date('2000/03/10')), new Date('2000/02/29')),
    ).to.equal(true);
  });
});
