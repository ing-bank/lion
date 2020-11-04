import { expect } from '@open-wc/testing';

import { getWeekdayNames } from '../../src/date/getWeekdayNames.js';

/**
 * @param {TemplateStringsArray} strings
 */
function s(strings) {
  return strings[0].split(' ');
}

describe('getWeekdayNames', () => {
  it('generates weekday names for a given locale with defaults (from Sunday, long style)', () => {
    expect(getWeekdayNames({ locale: 'en-GB' })).to.deep.equal(
      s`Sunday Monday Tuesday Wednesday Thursday Friday Saturday`,
    );
    expect(getWeekdayNames({ locale: 'nl-NL' })).to.deep.equal(
      s`zondag maandag dinsdag woensdag donderdag vrijdag zaterdag`,
    );
    expect(getWeekdayNames({ locale: 'zh-CH' })).to.deep.equal(
      s`星期日 星期一 星期二 星期三 星期四 星期五 星期六`,
    );
  });

  it('allows to specify a day when a week starts', () => {
    expect(getWeekdayNames({ locale: 'en-GB', firstDayOfWeek: 7 })).to.deep.equal(
      s`Sunday Monday Tuesday Wednesday Thursday Friday Saturday`,
    );
    expect(getWeekdayNames({ locale: 'en-GB', firstDayOfWeek: 1 })).to.deep.equal(
      s`Monday Tuesday Wednesday Thursday Friday Saturday Sunday`,
    );
    expect(getWeekdayNames({ locale: 'en-GB', firstDayOfWeek: 2 })).to.deep.equal(
      s`Tuesday Wednesday Thursday Friday Saturday Sunday Monday`,
    );
    expect(getWeekdayNames({ locale: 'en-GB', firstDayOfWeek: 3 })).to.deep.equal(
      s`Wednesday Thursday Friday Saturday Sunday Monday Tuesday`,
    );
    expect(getWeekdayNames({ locale: 'en-GB', firstDayOfWeek: 4 })).to.deep.equal(
      s`Thursday Friday Saturday Sunday Monday Tuesday Wednesday`,
    );
    expect(getWeekdayNames({ locale: 'en-GB', firstDayOfWeek: 5 })).to.deep.equal(
      s`Friday Saturday Sunday Monday Tuesday Wednesday Thursday`,
    );
    expect(getWeekdayNames({ locale: 'en-GB', firstDayOfWeek: 6 })).to.deep.equal(
      s`Saturday Sunday Monday Tuesday Wednesday Thursday Friday`,
    );
  });

  it('supports "short" style', () => {
    expect(getWeekdayNames({ locale: 'en-GB', style: 'short' })).to.deep.equal(
      s`Sun Mon Tue Wed Thu Fri Sat`,
    );
    expect(getWeekdayNames({ locale: 'nl-NL', style: 'short' })).to.deep.equal(
      s`zo ma di wo do vr za`,
    );
    expect(getWeekdayNames({ locale: 'zh-CH', style: 'short' })).to.deep.equal(
      s`周日 周一 周二 周三 周四 周五 周六`,
    );
  });

  it('supports "narrow" style', () => {
    expect(getWeekdayNames({ locale: 'en-GB', style: 'narrow' })).to.deep.equal(s`S M T W T F S`);
    expect(getWeekdayNames({ locale: 'nl-NL', style: 'narrow' })).to.deep.equal(s`Z M D W D V Z`);
    expect(getWeekdayNames({ locale: 'zh-CH', style: 'narrow' })).to.deep.equal(
      s`日 一 二 三 四 五 六`,
    );
  });
});
