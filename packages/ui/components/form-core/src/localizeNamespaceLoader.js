/* eslint-disable import/no-extraneous-dependencies */
export const localizeNamespaceLoader = /** @param {string} locale */ locale => {
  switch (locale) {
    case 'bg-BG':
      return import('@lion/ui/form-core-translations/bg-BG.js');
    case 'bg':
      return import('@lion/ui/form-core-translations/bg.js');
    case 'cs-CZ':
      return import('@lion/ui/form-core-translations/cs-CZ.js');
    case 'cs':
      return import('@lion/ui/form-core-translations/cs.js');
    case 'de-DE':
      return import('@lion/ui/form-core-translations/de-DE.js');
    case 'de':
      return import('@lion/ui/form-core-translations/de.js');
    case 'en-AU':
      return import('@lion/ui/form-core-translations/en-AU.js');
    case 'en-GB':
      return import('@lion/ui/form-core-translations/en-GB.js');
    case 'en-US':
      return import('@lion/ui/form-core-translations/en-US.js');
    case 'en-PH':
    case 'en':
      return import('@lion/ui/form-core-translations/en.js');
    case 'es-ES':
      return import('@lion/ui/form-core-translations/es-ES.js');
    case 'es':
      return import('@lion/ui/form-core-translations/es.js');
    case 'fr-FR':
      return import('@lion/ui/form-core-translations/fr-FR.js');
    case 'fr-BE':
      return import('@lion/ui/form-core-translations/fr-BE.js');
    case 'fr':
      return import('@lion/ui/form-core-translations/fr.js');
    case 'hu-HU':
      return import('@lion/ui/form-core-translations/hu-HU.js');
    case 'hu':
      return import('@lion/ui/form-core-translations/hu.js');
    case 'it-IT':
      return import('@lion/ui/form-core-translations/it-IT.js');
    case 'it':
      return import('@lion/ui/form-core-translations/it.js');
    case 'nl-BE':
      return import('@lion/ui/form-core-translations/nl-BE.js');
    case 'nl-NL':
      return import('@lion/ui/form-core-translations/nl-NL.js');
    case 'nl':
      return import('@lion/ui/form-core-translations/nl.js');
    case 'pl-PL':
      return import('@lion/ui/form-core-translations/pl-PL.js');
    case 'pl':
      return import('@lion/ui/form-core-translations/pl.js');
    case 'ro-RO':
      return import('@lion/ui/form-core-translations/ro-RO.js');
    case 'ro':
      return import('@lion/ui/form-core-translations/ro.js');
    case 'ru-RU':
      return import('@lion/ui/form-core-translations/ru-RU.js');
    case 'ru':
      return import('@lion/ui/form-core-translations/ru.js');
    case 'sk-SK':
      return import('@lion/ui/form-core-translations/sk-SK.js');
    case 'sk':
      return import('@lion/ui/form-core-translations/sk.js');
    case 'tr-TR':
      return import('@lion/ui/form-core-translations/tr-TR.js');
    case 'tr':
      return import('@lion/ui/form-core-translations/tr.js');
    case 'uk-UA':
      return import('@lion/ui/form-core-translations/uk-UA.js');
    case 'uk':
      return import('@lion/ui/form-core-translations/uk.js');
    case 'zh-CN':
    case 'zh':
      return import('@lion/ui/form-core-translations/zh.js');
    default:
      return import('@lion/ui/form-core-translations/en.js');
  }
};
