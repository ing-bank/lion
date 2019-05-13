import { expect } from '@open-wc/testing';

import { getMonthNames } from '../../src/date/getMonthNames.js';

function s(strings) {
  return strings[0].split(' ');
}

describe('getMonthNames', () => {
  it('generates month names for a given locale', () => {
    expect(getMonthNames({ locale: 'en-GB' })).to.deep.equal(
      s`January February March April May June July August September October November December`,
    );
    expect(getMonthNames({ locale: 'nl-NL' })).to.deep.equal(
      s`januari februari maart april mei juni juli augustus september oktober november december`,
    );
    expect(getMonthNames({ locale: 'zh-CH' })).to.deep.equal(
      s`一月 二月 三月 四月 五月 六月 七月 八月 九月 十月 十一月 十二月`,
    );
  });
});
