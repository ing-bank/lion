import { expect } from '@open-wc/testing';
import { localize } from '../../src/localize.js';
import { localizeTearDown } from '../../test-helpers.js';

import { formatDate } from '../../src/date/formatDate.js';
import { parseDate } from '../../src/date/parseDate.js';

describe('formatDate', () => {
  beforeEach(() => {
    localizeTearDown();
  });

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
    localize.locale = 'bg-BG';
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

  it('returns empty string when input is not a Date object', async () => {
    const date = '1-1-2016';
    expect(formatDate(date)).to.equal('');
  });
});
