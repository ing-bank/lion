import { expect } from '@open-wc/testing';
import { createMonth } from '../../src/utils/createMonth.js';
import { createWeek } from '../../src/utils/createWeek.js';

function compareMonth(obj) {
  obj.weeks.forEach((week, weeki) => {
    week.days.forEach((day, dayi) => {
      // eslint-disable-next-line no-param-reassign
      obj.weeks[weeki].days[dayi].date = obj.weeks[weeki].days[dayi].date.toISOString();
    });
  });
  return obj;
}

describe('createMonth', () => {
  it('creates month data with Sunday as first day of week by default', () => {
    expect(compareMonth(createMonth(new Date('2018/12/01')))).to.deep.equal(
      compareMonth({
        weeks: [
          createWeek(new Date('2018/11/25'), { firstDayOfWeek: 0 }),
          createWeek(new Date('2018/12/02'), { firstDayOfWeek: 0 }),
          createWeek(new Date('2018/12/09'), { firstDayOfWeek: 0 }),
          createWeek(new Date('2018/12/16'), { firstDayOfWeek: 0 }),
          createWeek(new Date('2018/12/23'), { firstDayOfWeek: 0 }),
          createWeek(new Date('2018/12/30'), { firstDayOfWeek: 0 }),
        ],
      }),
    );
  });

  it('can create month data for different first day of week', () => {
    expect(compareMonth(createMonth(new Date('2018/12/01'), { firstDayOfWeek: 1 }))).to.deep.equal(
      compareMonth({
        weeks: [
          createWeek(new Date('2018/11/26'), { firstDayOfWeek: 1 }),
          createWeek(new Date('2018/12/03'), { firstDayOfWeek: 1 }),
          createWeek(new Date('2018/12/10'), { firstDayOfWeek: 1 }),
          createWeek(new Date('2018/12/17'), { firstDayOfWeek: 1 }),
          createWeek(new Date('2018/12/24'), { firstDayOfWeek: 1 }),
          createWeek(new Date('2018/12/31'), { firstDayOfWeek: 1 }),
        ],
      }),
    );
  });
});
