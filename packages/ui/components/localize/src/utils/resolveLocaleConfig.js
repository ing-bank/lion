/**
 *
 * @param {string} namespace Namespace for the locale
 * @param {URL | URL[]} localeDir Directory of the locale
 * @returns Promise<LocaleConfig>
 */
export const resolveLocaleConfig = (namespace, localeDir) => ({
  [namespace]: async (locale = 'en') => {
    const loadLocaleConfig = (/** @type {URL} */ dir) => {
      const localePath = (/** @type {string} */ loc) => [dir, `${loc}.js`].join('/');
      const fallbackLocale = localePath(locale.replace(/-\w+/, ''));
      const defaultLocale = localePath('en');

      const resolvedModule = import(localePath(locale)).catch(reason => {
        console.warn(`
          Locale ${locale} not found. Reason ${reason}.
          Loading fallback locale ${fallbackLocale}`);
        return import(fallbackLocale).catch(() => {
          console.warn(`
            Fallback locale ${locale} not found. Reason ${reason}.
            Loading default locale ${defaultLocale}`);
          return import(defaultLocale);
        });
      });

      return resolvedModule;
    };

    const mergeMultipleConfigs = async (/** @type {URL[]} */ localeDirs) => {
      const localizeObjects = localeDirs.map(loadLocaleConfig);
      const combinedResult = await localizeObjects[0];

      for await (const localizeObject of localizeObjects.slice(1)) {
        Object.entries(localizeObject.default).forEach(([key, val]) => {
          combinedResult.default[key] = val;
        });
      }

      return combinedResult;
    };

    const localeConfig = Array.isArray(localeDir)
      ? mergeMultipleConfigs(localeDir)
      : loadLocaleConfig(localeDir);

    return localeConfig;
  },
});
