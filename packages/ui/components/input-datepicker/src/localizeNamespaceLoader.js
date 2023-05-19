import { supportedLocales } from '../../localize/src/LocalizeConfig.js';

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

export const localizeNamespaceLoader = /** @param {string} locale */ locale => {
  const localeCode = supportedLocales[locale] || 'en';
  return combineLocalizeImports([
    import(`@lion/ui/overlays-translations/${localeCode}.js`),
    import(`@lion/ui/input-datepicker-translations/${localeCode}.js`),
  ]);
};
