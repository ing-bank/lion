/**
 * @param {Promise<{default:object}>[]} importPromises
 */
async function combineLocalizeImports(importPromises) {
  const localizeObjects = await Promise.all(importPromises);
  const combinedResult = localizeObjects[0];
  for (const localizeObject of localizeObjects.slice(1)) {
    Object.entries(localizeObject.default).forEach(([key, val]) => {
      combinedResult.default[key] = val;
    });
  }
  return combinedResult;
}
/* eslint-disable import/no-extraneous-dependencies */
export const localizeNamespaceLoader = /** @param {string} locale */ locale => {
  switch (locale) {
    case 'bg-BG':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/bg-BG.js'),
        import('@lion/ui/input-datepicker-translations/bg-BG.js'),
      ]);
    case 'bg':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/bg.js'),
        import('@lion/ui/input-datepicker-translations/bg.js'),
      ]);
    case 'cs-CZ':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/cs-CZ.js'),
        import('@lion/ui/input-datepicker-translations/cs-CZ.js'),
      ]);
    case 'cs':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/cs.js'),
        import('@lion/ui/input-datepicker-translations/cs.js'),
      ]);
    case 'de-DE':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/de-DE.js'),
        import('@lion/ui/input-datepicker-translations/de-DE.js'),
      ]);
    case 'de':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/de.js'),
        import('@lion/ui/input-datepicker-translations/de.js'),
      ]);
    case 'en-AU':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/en-AU.js'),
        import('@lion/ui/input-datepicker-translations/en-AU.js'),
      ]);
    case 'en-GB':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/en-GB.js'),
        import('@lion/ui/input-datepicker-translations/en-GB.js'),
      ]);
    case 'en-US':
      return import('@lion/ui/input-datepicker-translations/en-US.js');
    case 'en-PH':
    case 'en':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/en.js'),
        import('@lion/ui/input-datepicker-translations/en.js'),
      ]);

    case 'es-ES':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/es-ES.js'),
        import('@lion/ui/input-datepicker-translations/es-ES.js'),
      ]);
    case 'es':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/es.js'),
        import('@lion/ui/input-datepicker-translations/es.js'),
      ]);
    case 'fr-FR':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/fr-FR.js'),
        import('@lion/ui/input-datepicker-translations/fr-FR.js'),
      ]);
    case 'fr-BE':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/fr-BE.js'),
        import('@lion/ui/input-datepicker-translations/fr-BE.js'),
      ]);
    case 'fr':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/fr.js'),
        import('@lion/ui/input-datepicker-translations/fr.js'),
      ]);
    case 'hu-HU':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/hu-HU.js'),
        import('@lion/ui/input-datepicker-translations/hu-HU.js'),
      ]);
    case 'hu':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/hu.js'),
        import('@lion/ui/input-datepicker-translations/hu.js'),
      ]);
    case 'it-IT':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/it-IT.js'),
        import('@lion/ui/input-datepicker-translations/it-IT.js'),
      ]);
    case 'it':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/it.js'),
        import('@lion/ui/input-datepicker-translations/it.js'),
      ]);
    case 'nl-BE':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/nl-BE.js'),
        import('@lion/ui/input-datepicker-translations/nl-BE.js'),
      ]);
    case 'nl-NL':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/nl-NL.js'),
        import('@lion/ui/input-datepicker-translations/nl-NL.js'),
      ]);
    case 'nl':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/nl.js'),
        import('@lion/ui/input-datepicker-translations/nl.js'),
      ]);
    case 'pl-PL':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/pl-PL.js'),
        import('@lion/ui/input-datepicker-translations/pl-PL.js'),
      ]);
    case 'pl':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/pl.js'),
        import('@lion/ui/input-datepicker-translations/pl.js'),
      ]);
    case 'ro-RO':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/ro-RO.js'),
        import('@lion/ui/input-datepicker-translations/ro-RO.js'),
      ]);
    case 'ro':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/ro.js'),
        import('@lion/ui/input-datepicker-translations/ro.js'),
      ]);
    case 'ru-RU':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/ru-RU.js'),
        import('@lion/ui/input-datepicker-translations/ru-RU.js'),
      ]);
    case 'ru':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/ru.js'),
        import('@lion/ui/input-datepicker-translations/ru.js'),
      ]);
    case 'sk-SK':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/sk-SK.js'),
        import('@lion/ui/input-datepicker-translations/sk-SK.js'),
      ]);
    case 'sk':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/sk.js'),
        import('@lion/ui/input-datepicker-translations/sk.js'),
      ]);
    case 'uk-UA':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/uk-UA.js'),
        import('@lion/ui/input-datepicker-translations/uk-UA.js'),
      ]);
    case 'uk':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/uk.js'),
        import('@lion/ui/input-datepicker-translations/uk.js'),
      ]);
    case 'zh-CN':
    case 'zh':
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/zh.js'),
        import('@lion/ui/input-datepicker-translations/zh.js'),
      ]);
    default:
      return combineLocalizeImports([
        import('@lion/ui/overlays-translations/en.js'),
        import('@lion/ui/input-datepicker-translations/en.js'),
      ]);
  }
};
