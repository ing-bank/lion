import MessageFormat from '@bundled-es-modules/message-format/MessageFormat.js';
import { LionSingleton } from '@lion/core';
import isLocalizeESModule from './isLocalizeESModule.js';

/**
 * `LocalizeManager` manages your translations (includes loading)
 */
export class LocalizeManager extends LionSingleton {
  // eslint-disable-line no-unused-vars
  constructor(params = {}) {
    super(params);
    this._fakeExtendsEventTarget();

    if (!document.documentElement.lang) {
      document.documentElement.lang = 'en-GB';
    }

    this._autoLoadOnLocaleChange = !!params.autoLoadOnLocaleChange;
    this._fallbackLocale = params.fallbackLocale;
    this.__storage = {};
    this.__namespacePatternsMap = new Map();
    this.__namespaceLoadersCache = {};
    this.__namespaceLoaderPromisesCache = {};
    this.formatNumberOptions = { returnIfNaN: '' };

    this._setupHtmlLangAttributeObserver();

    /**
     * Temp variable, so we can allow backwards compatibility on extension layer, like:
     * @example
     * ExtendedManager extends LocalizeManager {
     *   constructor(config, ...args) {
     *     super({ supportExternalTranslationTools: false, ...config }, ...args);
     *   }
     * }
     */
    if (params.supportExternalTranslationTools === false) {
      this._supportExternalTranslationTools = false;
    } else {
      this._supportExternalTranslationTools = true;
      // set initial locale
      this._setupTranslationToolSupport();
    }
  }

  _setupTranslationToolSupport() {
    /**
     * This value allows for support for Google Translate (or other 3rd parties taking control
     * of the html[lang] attribute).
     *
     * Have the following scenario in mind:
     * 1. locale is initialized by developer via html[data-localize-lang="en-US"] and
     * html[lang="en-US"]. When localize is loaded (note that this also can be after step 2 below),
     * it will sync its initial state from html[data-localize-lang]
     * 2. Google Translate kicks in for the French language. It will set html[lang="fr"].
     * This new language is not one known by us, so we most likely don't have translations for
     * this file. Therefore, we do NOT sync this value to LocalizeManager. The manager should
     * still ask for known resources (in this case for locale 'en-US')
     * 3. locale is changed (think of a language dropdown)
     * It's a bit of a weird case, because we would not expect an end user to do this. If he/she
     * does, make sure that we do not go against Google Translate, so we maintain accessibility
     * (by not altering html[lang]). We detect this by reading _langAttrSetByTranslationTool:
     * when its value is null, we consider Google translate 'not active'.
     *
     * When Google Translate is turned off by the user (html[lang=auto]),
     * `localize.locale` will be synced to html[lang] again
     *
     *
     * Keep in mind that all of the above also works with other tools than Google Translate,
     * but this is most widely used tool and therefore used as an example.
     */
    this._langAttrSetByTranslationTool = null;

    /**
     * Via html[data-localize-lang], developers are allowed to set the initial locale, without
     * having to worry about whether locale is initialized before 3rd parties like Google Translate.
     * When this value differs from html[lang], we assume the 3rd party took
     * control over the page language and we set this._langAttrSetByTranslationTool to html[lang]
     */
    const initalLangConfig = document.documentElement.getAttribute('data-localize-lang');
    this.locale = initalLangConfig || 'en-GB';
  }

  teardown() {
    this._teardownHtmlLangAttributeObserver();
  }

  // eslint-disable-next-line class-methods-use-this
  get locale() {
    if (this._supportExternalTranslationTools) {
      return this.__locale;
    }
    return document.documentElement.lang;
  }

  _setHtmlLangAttribute(locale) {
    this._teardownHtmlLangAttributeObserver();
    document.documentElement.lang = locale;
    this._setupHtmlLangAttributeObserver();
  }

  set locale(value) {
    let oldLocale;
    if (this._supportExternalTranslationTools) {
      oldLocale = this.__locale;
      this.__locale = value;
      if (this._langAttrSetByTranslationTool === null) {
        this._setHtmlLangAttribute(value);
      }
    } else {
      oldLocale = document.documentElement.lang;
      this._setHtmlLangAttribute(value);
    }

    if (!value.includes('-')) {
      this.__handleLanguageOnly(value);
    }

    this._onLocaleChanged(value, oldLocale);
  }

  // eslint-disable-next-line class-methods-use-this
  __handleLanguageOnly(value) {
    throw new Error(`
      Locale was set to ${value}.
      Language only locales are not allowed, please use the full language locale e.g. 'en-GB' instead of 'en'.
      See https://github.com/ing-bank/lion/issues/187 for more information.
    `);
  }

  get loadingComplete() {
    return Promise.all(Object.values(this.__namespaceLoaderPromisesCache[this.locale]));
  }

  reset() {
    this.__storage = {};
    this.__namespacePatternsMap = new Map();
    this.__namespaceLoadersCache = {};
    this.__namespaceLoaderPromisesCache = {};
  }

  addData(locale, namespace, data) {
    if (this._isNamespaceInCache(locale, namespace)) {
      throw new Error(
        `Namespace "${namespace}" has been already added for the locale "${locale}".`,
      );
    }

    this.__storage[locale] = this.__storage[locale] || {};
    this.__storage[locale][namespace] = data;
  }

  setupNamespaceLoader(pattern, loader) {
    this.__namespacePatternsMap.set(pattern, loader);
  }

  loadNamespaces(namespaces, { locale } = {}) {
    return Promise.all(namespaces.map(namespace => this.loadNamespace(namespace, { locale })));
  }

  loadNamespace(namespaceObj, { locale = this.locale } = { locale: this.locale }) {
    const isDynamicImport = typeof namespaceObj === 'object';

    const namespace = isDynamicImport ? Object.keys(namespaceObj)[0] : namespaceObj;

    if (this._isNamespaceInCache(locale, namespace)) {
      return Promise.resolve();
    }

    const existingLoaderPromise = this._getCachedNamespaceLoaderPromise(locale, namespace);
    if (existingLoaderPromise) {
      return existingLoaderPromise;
    }

    return this._loadNamespaceData(locale, namespaceObj, isDynamicImport, namespace);
  }

  msg(keys, vars, opts = {}) {
    const locale = opts.locale ? opts.locale : this.locale;
    const message = this._getMessageForKeys(keys, locale);
    if (!message) {
      return '';
    }
    const formatter = new MessageFormat(message, locale);
    return formatter.format(vars);
  }

  _setupHtmlLangAttributeObserver() {
    if (!this._htmlLangAttributeObserver) {
      this._htmlLangAttributeObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (this._supportExternalTranslationTools) {
            if (document.documentElement.lang === 'auto') { // Google Translate is switched off
              this._langAttrSetByTranslationTool = null;
              this._setHtmlLangAttribute(this.locale);
            } else {
              this._langAttrSetByTranslationTool = document.documentElement.lang;
            }
          } else {
            this._onLocaleChanged(document.documentElement.lang, mutation.oldValue);
          }
        });
      });
    }
    this._htmlLangAttributeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
      attributeOldValue: true,
    });
  }

  _teardownHtmlLangAttributeObserver() {
    this._htmlLangAttributeObserver.disconnect();
  }

  _isNamespaceInCache(locale, namespace) {
    return !!(this.__storage[locale] && this.__storage[locale][namespace]);
  }

  _getCachedNamespaceLoaderPromise(locale, namespace) {
    if (this.__namespaceLoaderPromisesCache[locale]) {
      return this.__namespaceLoaderPromisesCache[locale][namespace];
    }
    return null;
  }

  _loadNamespaceData(locale, namespaceObj, isDynamicImport, namespace) {
    const loader = this._getNamespaceLoader(namespaceObj, isDynamicImport, namespace);
    const loaderPromise = this._getNamespaceLoaderPromise(loader, locale, namespace);
    this._cacheNamespaceLoaderPromise(locale, namespace, loaderPromise);
    return loaderPromise.then(obj => {
      const data = isLocalizeESModule(obj) ? obj.default : obj;
      this.addData(locale, namespace, data);
    });
  }

  _getNamespaceLoader(namespaceObj, isDynamicImport, namespace) {
    let loader = this.__namespaceLoadersCache[namespace];

    if (!loader) {
      if (isDynamicImport) {
        loader = namespaceObj[namespace];
        this.__namespaceLoadersCache[namespace] = loader;
      } else {
        loader = this._lookupNamespaceLoader(namespace);
        this.__namespaceLoadersCache[namespace] = loader;
      }
    }

    if (!loader) {
      throw new Error(`Namespace "${namespace}" was not properly setup.`);
    }

    this.__namespaceLoadersCache[namespace] = loader;

    return loader;
  }

  _getNamespaceLoaderPromise(loader, locale, namespace, fallbackLocale = this._fallbackLocale) {
    return loader(locale, namespace).catch(() => {
      const lang = this._getLangFromLocale(locale);
      return loader(lang, namespace).catch(() => {
        if (fallbackLocale) {
          return this._getNamespaceLoaderPromise(loader, fallbackLocale, namespace, false).catch(
            () => {
              const fallbackLang = this._getLangFromLocale(fallbackLocale);
              throw new Error(
                `Data for namespace "${namespace}" and current locale "${locale}" or fallback locale "${fallbackLocale}" could not be loaded. ` +
                `Make sure you have data either for locale "${locale}" (and/or generic language "${lang}") or for fallback "${fallbackLocale}" (and/or "${fallbackLang}").`,
              );
            },
          );
        }
        throw new Error(
          `Data for namespace "${namespace}" and locale "${locale}" could not be loaded. ` +
          `Make sure you have data for locale "${locale}" (and/or generic language "${lang}").`,
        );
      });
    });
  }

  _cacheNamespaceLoaderPromise(locale, namespace, promise) {
    if (!this.__namespaceLoaderPromisesCache[locale]) {
      this.__namespaceLoaderPromisesCache[locale] = {};
    }
    this.__namespaceLoaderPromisesCache[locale][namespace] = promise;
  }

  _lookupNamespaceLoader(namespace) {
    /* eslint-disable no-restricted-syntax */
    for (const [key, value] of this.__namespacePatternsMap) {
      const isMatchingString = typeof key === 'string' && key === namespace;
      const isMatchingRegexp =
        typeof key === 'object' && key.constructor.name === 'RegExp' && key.test(namespace);
      if (isMatchingString || isMatchingRegexp) {
        return value;
      }
    }
    return null;
    /* eslint-enable no-restricted-syntax */
  }

  // eslint-disable-next-line class-methods-use-this
  _getLangFromLocale(locale) {
    return locale.substring(0, 2);
  }

  _fakeExtendsEventTarget() {
    const delegate = document.createDocumentFragment();
    ['addEventListener', 'dispatchEvent', 'removeEventListener'].forEach(funcName => {
      this[funcName] = (...args) => delegate[funcName](...args);
    });
  }

  _onLocaleChanged(newLocale, oldLocale) {
    if (newLocale === oldLocale) {
      return;
    }
    if (this._autoLoadOnLocaleChange) {
      this._loadAllMissing(newLocale, oldLocale);
    }
    this.dispatchEvent(new CustomEvent('localeChanged', { detail: { newLocale, oldLocale } }));
  }

  _loadAllMissing(newLocale, oldLocale) {
    const oldLocaleNamespaces = this.__storage[oldLocale] || {};
    const newLocaleNamespaces = this.__storage[newLocale] || {};
    const promises = [];
    Object.keys(oldLocaleNamespaces).forEach(namespace => {
      const newNamespaceData = newLocaleNamespaces[namespace];
      if (!newNamespaceData) {
        promises.push(this.loadNamespace(namespace));
      }
    });
    return Promise.all(promises);
  }

  _getMessageForKeys(keys, locale) {
    if (typeof keys === 'string') {
      return this._getMessageForKey(keys, locale);
    }
    const reversedKeys = Array.from(keys).reverse(); // Array.from prevents mutation of argument
    let key;
    let message;
    while (reversedKeys.length) {
      key = reversedKeys.pop();
      message = this._getMessageForKey(key, locale);
      if (message) {
        return message;
      }
    }
    return undefined;
  }

  _getMessageForKey(key, locale) {
    if (key.indexOf(':') === -1) {
      throw new Error(
        `Namespace is missing in the key "${key}". The format for keys is "namespace:name".`,
      );
    }
    const [ns, namesString] = key.split(':');
    const namespaces = this.__storage[locale];
    const messages = namespaces ? namespaces[ns] : null;
    const names = namesString.split('.');
    return names.reduce((message, n) => (message ? message[n] : null), messages);
  }
}
