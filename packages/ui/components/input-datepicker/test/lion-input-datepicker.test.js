import { expect } from '@open-wc/testing';
import { runDatepickerSuite } from '../test-suites/LionInputDatepicker.suite.js';
import { localizeNamespaceLoader } from '../src/localizeNamespaceLoader.js';

runDatepickerSuite();

describe('lion-input-datepicker localizeNamespaceLoader', () => {
  const supportedLocales = [
    'bg-BG',
    'bg',
    'cs-CZ',
    'cs',
    'de-DE',
    'de',
    'en-AU',
    'en-GB',
    'en-US',
    'en-PH',
    'en',
    'es-ES',
    'es',
    'fr-FR',
    'fr-BE',
    'fr',
    'hu-HU',
    'hu',
    'it-IT',
    'it',
    'nl-BE',
    'nl-NL',
    'nl',
    'pl-PL',
    'pl',
    'ro-RO',
    'ro',
    'ru-RU',
    'ru',
    'sk-SK',
    'sk',
    'tr-TR',
    'tr',
    'uk-UA',
    'uk',
    'zh-CN',
    'zh',
    'xx-XX', // falls back to English
  ];

  for (const locale of supportedLocales) {
    it(`provides the close button and invoker labels for "${locale}"`, async () => {
      const { default: namespace } = await localizeNamespaceLoader(locale);
      // `close` comes from the overlays translations, `openDatepickerLabel` from the datepicker's own
      expect(namespace.close, 'close').to.be.a('string').that.is.not.empty;
      expect(namespace.openDatepickerLabel, 'openDatepickerLabel').to.be.a('string').that.is.not
        .empty;
    });
  }
});
