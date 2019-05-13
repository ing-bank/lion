import { expect } from '@open-wc/testing';
import { formatDate } from '../../../localize/src/date/formatDate.js';
import { getFirstDayNextMonth } from '../../src/utils/getFirstDayNextMonth.js';

describe('getFirstDayNextMonth', () => {
  it('returns the first day of the next month', () => {
    expect(formatDate(getFirstDayNextMonth(new Date('2001/01/01')))).to.be.equal('01/02/2001');
    expect(formatDate(getFirstDayNextMonth(new Date('2001/10/10')))).to.be.equal('01/11/2001');
    expect(formatDate(getFirstDayNextMonth(new Date('2000/03/10')))).to.be.equal('01/04/2000');
  });
});
