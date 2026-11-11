import { expect } from '@open-wc/testing';
import { createMultipleMonth } from '../../src/utils/createMultipleMonth.js';
import { createMonth } from '../../src/utils/createMonth.js';

/**
 * @param {{ months: import('../../types/day.js').Month[]}} obj
 */
function compareMultipleMonth(obj) {
  obj.months.forEach((month, monthi) => {
    month.weeks.forEach((week, weeki) => {
      week.days.forEach((day, dayi) => {
        // @ts-expect-error since we are converting Date to ISO string, but that's okay for our test Date comparisons
        // eslint-disable-next-line no-param-reassign
        obj.months[monthi].weeks[weeki].days[dayi].date =
          obj.months[monthi].weeks[weeki].days[dayi].date.toISOString();
      });
    });
  });
  return obj;
}

describe('createMultipleMonth', () => {
  it('creates 1 month by default', () => {
    expect(compareMultipleMonth(createMultipleMonth(new Date('2018/12/01')))).to.deep.equal(
      compareMultipleMonth({
        months: [createMonth(new Date('2018/12/01'))],
      }),
    );
  });

  it('can create extra months in the past', () => {
    expect(
      compareMultipleMonth(createMultipleMonth(new Date('2018/12/01'), { pastMonths: 2 })),
    ).to.deep.equal(
      compareMultipleMonth({
        months: [
          createMonth(new Date('2018/10/01')),
          createMonth(new Date('2018/11/01')),
          createMonth(new Date('2018/12/01')),
        ],
      }),
    );
  });

  it('can create extra months in the future', () => {
    expect(
      compareMultipleMonth(createMultipleMonth(new Date('2018/12/01'), { futureMonths: 2 })),
    ).to.deep.equal(
      compareMultipleMonth({
        months: [
          createMonth(new Date('2018/12/01')),
          createMonth(new Date('2019/01/01')),
          createMonth(new Date('2019/02/01')),
        ],
      }),
    );
  });

  it('can create extra months in the past and future', () => {
    expect(
      compareMultipleMonth(
        createMultipleMonth(new Date('2018/12/01'), { pastMonths: 1, futureMonths: 1 }),
      ),
    ).to.deep.equal(
      compareMultipleMonth({
        months: [
          createMonth(new Date('2018/11/01')),
          createMonth(new Date('2018/12/01')),
          createMonth(new Date('2019/01/01')),
        ],
      }),
    );
  });
});
