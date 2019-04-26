/* eslint-env mocha */
import { expect } from '@open-wc/testing';
import { localize } from '../src/localize.js';
import { localizeTearDown } from '../test-helpers.js';

import { formatDate, parseDate, getDateFormatBasedOnLocale } from '../src/formatDate.js';

beforeEach(() => {
  localizeTearDown();
});

describe('formatDate', () => {
  it('displays the appropriate date based on locale', async () => {
    const testDate = new Date('2012/05/21');

    expect(formatDate(testDate)).to.equal('21/05/2012');

    localize.locale = 'nl-NL';
    expect(formatDate(testDate)).to.equal('21-05-2012');

    localize.locale = 'fr-FR';
    expect(formatDate(testDate)).to.equal('21/05/2012');

    localize.locale = 'de-DE';
    expect(formatDate(testDate)).to.equal('21.05.2012');

    localize.locale = 'en-US';
    expect(formatDate(testDate)).to.equal('05/21/2012');
  });

  it('displays the date based on options', async () => {
    const testDate = new Date('2012/05/21');
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    };

    expect(formatDate(testDate, options)).to.equal('Monday, 21 May 2012');
    localize.locale = 'nl-NL';
    expect(formatDate(testDate, options)).to.equal('maandag 21 mei 2012');
    localize.locale = 'fr-FR';
    expect(formatDate(testDate, options)).to.equal('lundi 21 mai 2012');
    localize.locale = 'de-DE';
    expect(formatDate(testDate, options)).to.equal('Montag, 21. Mai 2012');
    localize.locale = 'en-US';
    expect(formatDate(testDate, options)).to.equal('Monday, May 21, 2012');
  });

  it('displays Bulgarian dates correctly', async () => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      locale: 'en-US',
    };
    localize.locale = 'bg';
    let date = parseDate('29-12-2017');
    expect(formatDate(date)).to.equal('29.12.2017 г.');

    date = parseDate('13-1-1940');
    expect(formatDate(date)).to.equal('13.01.1940 г.');

    date = parseDate('3-11-1970');
    expect(formatDate(date, options)).to.equal('Tuesday, November 03, 1970');
  });

  it('displays US dates correctly', async () => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      locale: 'en-US',
    };
    localize.locale = 'en-US';
    let date = parseDate('29-12-1940');
    expect(formatDate(date)).to.equal('12/29/1940');

    date = parseDate('13-01-1940');
    expect(formatDate(date)).to.equal('01/13/1940');

    date = parseDate('3-11-1970');
    expect(formatDate(date, options)).to.equal('Tuesday, November 03, 1970');
  });

  it('handles locales in options', async () => {
    let options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      locale: 'en-US',
    };
    let parsedDate = parseDate('05.11.2017');
    expect(formatDate(parsedDate, options)).to.equal('Sunday, November 05, 2017');

    parsedDate = parseDate('01-01-1940');
    options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      locale: 'nl-BE',
    };
    expect(formatDate(parsedDate, options)).to.equal('maandag 01 januari 1940');
  });

  it('returns a zero-date when input is not a Date object', async () => {
    const date = '1-1-2016';
    expect(formatDate(date)).to.equal('0000-00-00');
  });
});

describe('parseDate()', () => {
  function equalsDate(value, date) {
    return (
      Object.prototype.toString.call(value) === '[object Date]' && // is Date Object
      value.getDate() === date.getDate() && // day
      value.getMonth() === date.getMonth() && // month
      value.getFullYear() === date.getFullYear() // year
    );
  }

  afterEach(() => {
    // makes sure that between tests the localization is reset to default state
    document.documentElement.lang = 'en-GB';
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
    expect(equalsDate(parseDate('12.12.1976'), new Date('1976/12/12'))).to.equal(true);
    expect(equalsDate(parseDate('13.12.1976'), new Date('1976/12/13'))).to.equal(true);
    expect(equalsDate(parseDate('14.12.1976'), new Date('1976/12/14'))).to.equal(true);
    expect(equalsDate(parseDate('14.12-1976'), new Date('1976/12/14'))).to.equal(true);
    expect(equalsDate(parseDate('14-12/1976'), new Date('1976/12/14'))).to.equal(true);
  });
  it('return undefined when no valid date provided', () => {
    expect(parseDate('12.12.1976.,')).to.equal(undefined);
  });
});

describe('getDateFormatBasedOnLocale()', () => {
  it('returns the positions of day, month and year', async () => {
    localize.locale = 'en-GB';
    expect(getDateFormatBasedOnLocale()).to.equal('day-month-year');
    localize.locale = 'en-US';
    expect(getDateFormatBasedOnLocale()).to.equal('month-day-year');
  });
});
