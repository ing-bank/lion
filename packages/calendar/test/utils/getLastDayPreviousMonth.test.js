import { expect } from '@open-wc/testing';
import { formatDate } from '../../../localize/src/date/formatDate.js';
import { getLastDayPreviousMonth } from '../../src/utils/getLastDayPreviousMonth.js';

describe('getLastDayPreviousMonth', () => {
  it('returns the last day of the previous month', () => {
    expect(formatDate(getLastDayPreviousMonth(new Date('2001/01/01')))).to.be.equal('31/12/2000');
    expect(formatDate(getLastDayPreviousMonth(new Date('2001/10/10')))).to.be.equal('30/09/2001');
    expect(formatDate(getLastDayPreviousMonth(new Date('2000/03/10')))).to.be.equal('29/02/2000');
  });
});
