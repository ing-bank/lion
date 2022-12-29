import { expect } from '@open-wc/testing';
import { parseDate, getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';
import { localizeTearDown } from '@lion/ui/localize-test-helpers.js';

/**
 *
 * @param {Date | undefined} value
 * @param {Date | undefined} date
 */
function equalsDate(value, date) {
  return (
    Object.prototype.toString.call(value) === '[object Date]' && // is Date Object
    value &&
    value.getDate() === date?.getDate() && // day
    value.getMonth() === date.getMonth() && // month
    value.getFullYear() === date.getFullYear() // year
  );
}

describe('parseDate()', () => {
  const localizeManager = getLocalizeManager();
  beforeEach(() => {
    localizeTearDown();
  });

  it('adds leading zeros', () => {
    expect(equalsDate(parseDate('1-1-1979'), new Date('1979/01/01'))).to.equal(true);
    expect(equalsDate(parseDate('1-11-1979'), new Date('1979/11/01'))).to.equal(true);
  });

  it('creates a date object', () => {
    expect(parseDate('10/10/2000') instanceof Date).to.equal(true);
  });

  it('returns a date object', () => {
    expect(equalsDate(parseDate('1-1-1979'), new Date('1979/01/01'))).to.equal(true);
    expect(equalsDate(parseDate('31.12.1970'), new Date('1970/12/31'))).to.equal(true);
  });

  it('handles all kind of delimiters', () => {
    expect(equalsDate(parseDate('12-12-1976'), new Date('1976/12/12'))).to.equal(true);
    expect(equalsDate(parseDate('13 12 1976'), new Date('1976/12/13'))).to.equal(true);
    expect(equalsDate(parseDate('14.12.1976'), new Date('1976/12/14'))).to.equal(true);
    expect(equalsDate(parseDate('14. 12. 1976.'), new Date('1976/12/14'))).to.equal(true);
    expect(equalsDate(parseDate('14.12.1976 r.'), new Date('1976/12/14'))).to.equal(true);
  });

  it('handles different locales', () => {
    localizeManager.locale = 'en-GB';
    expect(equalsDate(parseDate('31-12-1976'), new Date('1976/12/31'))).to.equal(true);
    localizeManager.locale = 'en-US';
    expect(equalsDate(parseDate('12-31-1976'), new Date('1976/12/31'))).to.equal(true);
  });

  it('handles timezones of the browser and parsed date correctly', () => {
    const referenceDate = new Date('2020/01/30');
    localizeManager.locale = 'nl-NL';
    const parsedDate = parseDate('30-01-2020');
    // time zone offset of parsed date: this value is dependent on the browser (basically where the ci or local machine it runs in is located)
    const parseDateOffset = parsedDate?.getTimezoneOffset();
    // The parseDate time zone should be equal to the default offset of the browser
    const browserTimeZoneOffset = referenceDate.getTimezoneOffset();
    // This will pass, since parseDate respects browser timezone, and not UTC format
    expect(parseDateOffset).to.equal(browserTimeZoneOffset);
    // Optional: verify we are dealing with the same date (this is already tested in other tests?)
    expect(equalsDate(referenceDate, parsedDate)).to.be.true;
  });

  it('return undefined when no valid date provided', () => {
    expect(parseDate('12.12.1976.,')).to.equal(undefined); // wrong delimiter
    expect(parseDate('foo')).to.equal(undefined); // no date

    localizeManager.locale = 'en-GB';
    expect(parseDate('31.02.2020')).to.equal(undefined); // non existing date
    expect(parseDate('12.31.2020')).to.equal(undefined); // day & month switched places

    localizeManager.locale = 'en-US';
    expect(parseDate('02.31.2020')).to.equal(undefined); // non existing date
    expect(parseDate('31.12.2020')).to.equal(undefined); // day & month switched places
  });
});
