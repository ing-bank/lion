import { expect } from '@open-wc/testing';
import { localize, formatDate, parseDate } from '@lion/components/localize.js';
import { localizeTearDown } from '@lion/components/localize-test-helpers.js';

const SUPPORTED_LOCALES = {
  'bg-BG': 'Bulgarian',
  'cs-CZ': 'Czech',
  'de-DE': 'German (Germany)',
  'en-AU': 'English (Australia)',
  'en-GB': 'English (United Kingdom)',
  'en-PH': 'English (Philippines)',
  'en-US': 'English (United States)',
  'es-ES': 'Spanish (Spain)',
  'fr-FR': 'French (France)',
  'fr-BE': 'French (Belgium)',
  'hu-HU': 'Hungarian (Hungary)',
  'id-ID': 'Indonesian (Indonesia)',
  'it-IT': 'Italian (Italy)',
  'nl-NL': 'Dutch (Netherlands)',
  'nl-BE': 'Dutch (Belgium)',
  'pl-PL': 'Polish (Poland)',
  'ro-RO': 'Romanian (Romania)',
  'ru-RU': 'Russian (Russia)',
  'sk-SK': 'Slovak (Slovakia)',
  'tr-TR': 'Turkish (Turkey)',
  'uk-UA': 'Ukrainian (Ukraine)',
  'zh-CN': 'Chinese (China)',
  'zh-Hans': 'Chinese (Simplified Han)',
  'zh-Hans-CN': 'Chinese (Simplified Han, China)',
  'zh-Hans-HK': 'Chinese (Simplified Han, Hong Kong SAR China)',
  'zh-Hans-MO': 'Chinese (Simplified Han, Macau SAR China)',
  'zh-Hans-SG': 'Chinese (Simplified Han, Singapore)',
  'zh-Hant': 'Chinese (Traditional Han)',
  'zh-Hant-HK': 'Chinese (Traditional Han, Hong Kong SAR China)',
  'zh-Hant-MO': 'Chinese (Traditional Han, Macau SAR China)',
  'zh-Hant-TW': 'Chinese (Traditional Han, Taiwan)',
};

/**
 * @typedef {import('../../types/LocalizeMixinTypes').FormatDateOptions} FormatDateOptions
 */

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
    /** @type {FormatDateOptions} */
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

  it('displays Hungarian dates correctly', async () => {
    /** @type {FormatDateOptions} */
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      locale: 'en-US',
    };
    localize.locale = 'hu-HU';
    let date = /** @type {Date} */ (parseDate('2018-5-28'));
    expect(formatDate(date)).to.equal('2018. 05. 28.');

    date = /** @type {Date} */ (parseDate('1970-11-3'));
    expect(formatDate(date, options)).to.equal('Tuesday, November 03, 1970');
  });

  it('displays Bulgarian dates correctly', async () => {
    /** @type {FormatDateOptions} */
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      locale: 'en-US',
    };
    localize.locale = 'bg-BG';
    let date = /** @type {Date} */ (parseDate('29-12-2017'));
    expect(formatDate(date)).to.equal('29.12.2017 г.');

    date = /** @type {Date} */ (parseDate('13-1-1940'));
    expect(formatDate(date)).to.equal('13.01.1940 г.');

    date = /** @type {Date} */ (parseDate('3-11-1970'));
    expect(formatDate(date, options)).to.equal('Tuesday, November 03, 1970');
  });

  it('displays US dates correctly', async () => {
    /** @type {FormatDateOptions} */
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      locale: 'en-US',
    };
    localize.locale = 'en-US';
    let date = /** @type {Date} */ (parseDate('12-29-1940'));
    expect(formatDate(date)).to.equal('12/29/1940');

    date = /** @type {Date} */ (parseDate('1-13-1940'));
    expect(formatDate(date)).to.equal('01/13/1940');

    date = /** @type {Date} */ (parseDate('11-3-1970'));
    expect(formatDate(date, options)).to.equal('Tuesday, November 03, 1970');
  });

  it('handles locales in options', async () => {
    /** @type {FormatDateOptions} */
    let options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      locale: 'en-US',
    };
    let parsedDate = /** @type {Date} */ (parseDate('05.11.2017'));
    expect(formatDate(parsedDate, options)).to.equal('Sunday, November 05, 2017');

    parsedDate = /** @type {Date} */ (parseDate('01-01-1940'));
    options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      locale: 'nl-BE',
    };
    expect(formatDate(parsedDate, options)).to.equal('maandag 01 januari 1940');
  });

  describe('Date format options without "year"', () => {
    const LOCALE_FORMATTED_DATE_MAP = {
      'bg-BG': 'събота, 12 октомври',
      'cs-CZ': 'sobota 12. října',
      'de-DE': 'Samstag, 12. Oktober',
      'en-AU': 'Saturday, 12 October',
      'en-GB': 'Saturday, 12 October',
      'en-PH': 'Saturday, 12 October',
      'en-US': 'Saturday, October 12',
      'es-ES': 'sábado, 12 de octubre',
      'fr-FR': 'samedi 12 octobre',
      'fr-BE': 'samedi 12 octobre',
      'hu-HU': 'október 12., szombat',
      'id-ID': 'Sabtu, 12 Oktober',
      'it-IT': 'sabato 12 ottobre',
      'nl-NL': 'zaterdag 12 oktober',
      'nl-BE': 'zaterdag 12 oktober',
      'pl-PL': 'sobota, 12 października',
      'ro-RO': 'sâmbătă, 12 octombrie',
      'ru-RU': 'суббота, 12 октября',
      'sk-SK': 'sobota 12. októbra',
      'tr-TR': '12 Ekim Cumartesi',
      'uk-UA': 'субота, 12 жовтня',
      'zh-CN': '10月12日星期六',
      'zh-Hans': '10月12日星期六',
      'zh-Hans-CN': '10月12日星期六',
      'zh-Hans-HK': '10月12日星期六',
      'zh-Hans-MO': '10月12日星期六',
      'zh-Hans-SG': '10月12日星期六',
      'zh-Hant': '10月12日 星期六',
      'zh-Hant-HK': '10月12日星期六',
      'zh-Hant-MO': '10月12日星期六',
      'zh-Hant-TW': '10月12日 星期六',
    };

    Object.keys(SUPPORTED_LOCALES).forEach(locale => {
      it(`handles options without year for locale: ${locale}`, async () => {
        /** @type {FormatDateOptions} */
        const options = {
          weekday: 'long',
          month: 'long',
          day: '2-digit',
          locale,
        };
        const parsedDate = /** @type {Date} */ (parseDate('12.10.2019'));
        expect(formatDate(parsedDate, options)).to.equal(LOCALE_FORMATTED_DATE_MAP[locale]);
      });
    });
  });

  it('handles options without month', async () => {
    /** @type {FormatDateOptions} */
    const options = {
      weekday: 'long',
      year: 'numeric',
      day: '2-digit',
    };
    const parsedDate = /** @type {Date} */ (parseDate('12.10.2019'));
    expect(formatDate(parsedDate, options)).to.equal('Saturday 12 2019');
  });

  it('handles options without day', async () => {
    /** @type {FormatDateOptions} */
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
    };
    const parsedDate = /** @type {Date} */ (parseDate('12.10.2019'));
    expect(formatDate(parsedDate, options)).to.equal('October 2019 Saturday');
  });

  it('returns empty string when input is not a Date object', async () => {
    const date = '1-1-2016';
    // @ts-ignore tests what happens if you use a wrong type
    expect(formatDate(date)).to.equal('');
  });

  describe('Date post processors', () => {
    /**
     * Uppercase processor
     *
     * @param {string} str
     * @returns {string}
     */
    const upperCaseProcessor = str => str.toUpperCase();

    /**
     * Lowercase processor
     *
     * @param {string} str
     * @returns {string}
     */
    const lowerCaseProcessor = str => str.toLocaleLowerCase();

    it('displays the appropriate date after post processor set in options', async () => {
      const testDate = new Date('2012/05/21');
      const postProcessors = new Map();
      postProcessors.set('nl-NL', upperCaseProcessor);
      postProcessors.set('de-DE', lowerCaseProcessor);

      /** @type {FormatDateOptions} */
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        postProcessors,
      };

      // locale is en-GB
      expect(formatDate(testDate, options)).to.equal('Monday, 21 May 2012');
      localize.locale = 'nl-NL';
      expect(formatDate(testDate, options)).to.equal('MAANDAG 21 MEI 2012');
      localize.locale = 'de-DE';
      expect(formatDate(testDate, options)).to.equal('montag, 21. mai 2012');
      localize.locale = 'en-US';
      expect(formatDate(testDate, options)).to.equal('Monday, May 21, 2012');
    });

    it('displays the appropriate date after post processor set in localize', async () => {
      const testDate = new Date('2012/05/21');
      /** @type {FormatDateOptions} */
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: '2-digit',
      };
      localize.setDatePostProcessorForLocale({
        locale: 'nl-NL',
        postProcessor: upperCaseProcessor,
      });
      localize.setDatePostProcessorForLocale({
        locale: 'de-DE',
        postProcessor: upperCaseProcessor,
      });

      expect(formatDate(testDate, options)).to.equal('Monday, 21 May 2012');
      localize.locale = 'nl-NL';
      expect(formatDate(testDate, options)).to.equal('MAANDAG 21 MEI 2012');
      localize.locale = 'de-DE';
      expect(formatDate(testDate, options)).to.equal('MONTAG, 21. MAI 2012');
      localize.locale = 'en-US';
      expect(formatDate(testDate, options)).to.equal('Monday, May 21, 2012');
    });

    it('displays the appropriate date after post processors set in options and localize', async () => {
      const testDate = new Date('2012/05/21');
      const postProcessors = new Map();
      postProcessors.set('nl-NL', upperCaseProcessor);
      postProcessors.set('de-DE', upperCaseProcessor);

      /** @type {FormatDateOptions} */
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        postProcessors,
      };

      localize.setDatePostProcessorForLocale({
        locale: 'de-DE',
        postProcessor: lowerCaseProcessor,
      });

      expect(formatDate(testDate, options)).to.equal('Monday, 21 May 2012');
      localize.locale = 'nl-NL';
      expect(formatDate(testDate, options)).to.equal('MAANDAG 21 MEI 2012');
      localize.locale = 'de-DE';
      expect(formatDate(testDate, options)).to.equal('MONTAG, 21. MAI 2012');
      localize.locale = 'en-US';
      expect(formatDate(testDate, options)).to.equal('Monday, May 21, 2012');
    });
  });
});
