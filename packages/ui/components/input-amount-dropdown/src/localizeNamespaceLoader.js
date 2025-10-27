/* eslint-disable import/no-extraneous-dependencies */
export const localizeNamespaceLoader = /** @param {string} locale */ locale => {
  switch (locale) {
    case 'bg-BG':
    case 'bg':
      return import('@lion/ui/input-amount-dropdown-translations/bg.js');
    case 'cs-CZ':
    case 'cs':
      return import('@lion/ui/input-amount-dropdown-translations/cs.js');
    case 'de-DE':
    case 'de':
      return import('@lion/ui/input-amount-dropdown-translations/de.js');
    case 'en-AU':
    case 'en-GB':
    case 'en-US':
    case 'en-PH':
    case 'en':
      return import('@lion/ui/input-amount-dropdown-translations/en.js');
    case 'es-ES':
    case 'es':
      return import('@lion/ui/input-amount-dropdown-translations/es.js');
    case 'fr-FR':
    case 'fr-BE':
    case 'fr':
      return import('@lion/ui/input-amount-dropdown-translations/fr.js');
    case 'hu-HU':
    case 'hu':
      return import('@lion/ui/input-amount-dropdown-translations/hu.js');
    case 'id-ID':
    case 'id':
      return import('@lion/ui/input-amount-dropdown-translations/id.js');
    case 'it-IT':
    case 'it':
      return import('@lion/ui/input-amount-dropdown-translations/it.js');
    case 'nl-BE':
    case 'nl-NL':
    case 'nl':
      return import('@lion/ui/input-amount-dropdown-translations/nl.js');
    case 'pl-PL':
    case 'pl':
      return import('@lion/ui/input-amount-dropdown-translations/pl.js');
    case 'ro-RO':
    case 'ro':
      return import('@lion/ui/input-amount-dropdown-translations/ro.js');
    case 'ru-RU':
    case 'ru':
      return import('@lion/ui/input-amount-dropdown-translations/ru.js');
    case 'sk-SK':
    case 'sk':
      return import('@lion/ui/input-amount-dropdown-translations/sk.js');
    case 'uk-UA':
    case 'uk':
      return import('@lion/ui/input-amount-dropdown-translations/uk.js');
    case 'zh-CN':
    case 'zh':
      return import('@lion/ui/input-amount-dropdown-translations/zh.js');
    default:
      return import('@lion/ui/input-amount-dropdown-translations/en.js');
  }
};
