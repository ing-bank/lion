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
  it('supports "short" style', () => {
    expect(getMonthNames({ locale: 'en-GB', style: 'short' })).to.deep.equal(
      s`Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec`,
    );
    expect(getMonthNames({ locale: 'nl-NL', style: 'short' })).to.deep.equal(
      s`jan. feb. mrt. apr. mei jun. jul. aug. sep. okt. nov. dec.`,
    );
    expect(getMonthNames({ locale: 'zh-CH', style: 'short' })).to.deep.equal(
      s`1月 2月 3月 4月 5月 6月 7月 8月 9月 10月 11月 12月`,
    );
  });
});
