/**
 *
 * @param {string} namespace Namespace for the locale
 * @param {any} localeDir Directory of the locale
 * @returns Promise<LocaleConfig>
 */
export const resolveLocaleConfig = (namespace, localeDir) => ({
  [namespace]: (locale = 'en') => {
    const localePath = (/** @type {string} */ loc) => [localeDir, `${loc}.js`].join('/');

    const fallbackLocale = localePath(locale.replace(/-\w+/, ''));

    return import(localePath(locale)).catch(reason => {
      console.warn(`
        Locale ${locale} not found. Reason ${reason}.
        Loading fallback locale ${fallbackLocale}`);
      return import(fallbackLocale);
    });
  },
});
