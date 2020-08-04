import MessageFormat from '@bundled-es-modules/message-format/MessageFormat.js';
import isLocalizeESModule from './isLocalizeESModule.js';

/**
 * @typedef {import('../types/LocalizeMixinTypes').NamespaceObject} NamespaceObject
 */

/**
 * `LocalizeManager` manages your translations (includes loading)
 */
export class LocalizeManager {
  // eslint-disable-line no-unused-vars
  constructor({ autoLoadOnLocaleChange = false, fallbackLocale = '' } = {}) {
    this.__delegationTarget = document.createDocumentFragment();
    this._autoLoadOnLocaleChange = !!autoLoadOnLocaleChange;
    this._fallbackLocale = fallbackLocale;

    /** @type {Object.<string, Object.<string, Object>>} */
    this.__storage = {};

    /** @type {Map.<RegExp|string, function>} */
    this.__namespacePatternsMap = new Map();

    /** @type {Object.<string, function|null>} */
    this.__namespaceLoadersCache = {};

    /** @type {Object.<string, Object.<string, Promise.<Object>>>} */
    this.__namespaceLoaderPromisesCache = {};

    this.formatNumberOptions = {
      returnIfNaN: '',
    };

    /**
     * Via html[data-localize-lang], developers are allowed to set the initial locale, without
     * having to worry about whether locale is initialized before 3rd parties like Google Translate.
     * When this value differs from html[lang], we assume the 3rd party took
     * control over the page language and we set this._langAttrSetByTranslationTool to html[lang]
     */
    const initialLocale = document.documentElement.getAttribute('data-localize-lang');

    this._supportExternalTranslationTools = Boolean(initialLocale);

    if (this._supportExternalTranslationTools) {
      this.locale = initialLocale || 'en-GB';
      this._setupTranslationToolSupport();
    }

    if (!document.documentElement.lang) {
      document.documentElement.lang = this.locale || 'en-GB';
    }

    this._setupHtmlLangAttributeObserver();
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
     * Keep in mind that all of the above also works with other tools than Google Translate,
     * but this is the most widely used tool and therefore used as an example.
     */
    this._langAttrSetByTranslationTool = document.documentElement.lang || null;
  }

  teardown() {
    this._teardownHtmlLangAttributeObserver();
  }

  /**
   * @returns {string}
   */
  get locale() {
    if (this._supportExternalTranslationTools) {
      return this.__locale || '';
    }
    return document.documentElement.lang;
  }

  /**
   * @param {string} value
   */
  set locale(value) {
    /** @type {string} */
    let oldLocale;
    if (this._supportExternalTranslationTools) {
      oldLocale = /** @type {string} */ (this.__locale);
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

  /**
   * @param {string} locale
   */
  _setHtmlLangAttribute(locale) {
    this._teardownHtmlLangAttributeObserver();
    document.documentElement.lang = locale;
    this._setupHtmlLangAttributeObserver();
  }

  /**
   * @param {string} value
   * @throws {Error} Language only locales are not allowed(Use 'en-GB' instead of 'en')
   */
  // eslint-disable-next-line class-methods-use-this
  __handleLanguageOnly(value) {
    throw new Error(`
      Locale was set to ${value}.
      Language only locales are not allowed, please use the full language locale e.g. 'en-GB' instead of 'en'.
      See https://github.com/ing-bank/lion/issues/187 for more information.
    `);
  }

  /**
   * @returns {Promise.<Object>}
   */
  get loadingComplete() {
    return Promise.all(Object.values(this.__namespaceLoaderPromisesCache[this.locale]));
  }

  reset() {
    this.__storage = {};
    this.__namespacePatternsMap = new Map();
    this.__namespaceLoadersCache = {};
    this.__namespaceLoaderPromisesCache = {};
  }

  /**
   * @param {string} locale
   * @param {string} namespace
   * @param {object} data
   * @throws {Error} Namespace can be added only once, for a given locale
   */
  addData(locale, namespace, data) {
    if (this._isNamespaceInCache(locale, namespace)) {
      throw new Error(
        `Namespace "${namespace}" has been already added for the locale "${locale}".`,
      );
    }

    this.__storage[locale] = this.__storage[locale] || {};
    this.__storage[locale][namespace] = data;
  }

  /**
   * @param {RegExp|string} pattern
   * @param {function} loader
   */
  setupNamespaceLoader(pattern, loader) {
    this.__namespacePatternsMap.set(pattern, loader);
  }

  /**
   * @param {NamespaceObject[]} namespaces
   * @param {Object} [options]
   * @param {string} [options.locale]
   * @returns {Promise.<Object>}
   */
  loadNamespaces(namespaces, { locale } = {}) {
    return Promise.all(
      namespaces.map(
        /** @param {NamespaceObject} namespace */
        namespace => this.loadNamespace(namespace, { locale }),
      ),
    );
  }

  /**
   * @param {NamespaceObject} namespaceObj
   * @param {Object} [options]
   * @param {string} [options.locale]
   * @returns {Promise.<Object|void>}
   */
  loadNamespace(namespaceObj, { locale = this.locale } = { locale: this.locale }) {
    const isDynamicImport = typeof namespaceObj === 'object';

    const namespace = /** @type {string} */ (isDynamicImport
      ? Object.keys(namespaceObj)[0]
      : namespaceObj);

    if (this._isNamespaceInCache(locale, namespace)) {
      return Promise.resolve();
    }

    const existingLoaderPromise = this._getCachedNamespaceLoaderPromise(locale, namespace);
    if (existingLoaderPromise) {
      return existingLoaderPromise;
    }

    return this._loadNamespaceData(locale, namespaceObj, isDynamicImport, namespace);
  }

  /**
   * @param {string | string[]} keys
   * @param {Object.<string,?>} [vars]
   * @param {Object} [opts]
   * @param {string} [opts.locale]
   * @returns {string}
   */
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
            if (document.documentElement.lang === 'auto') {
              // Google Translate is switched off
              this._langAttrSetByTranslationTool = null;
              this._setHtmlLangAttribute(this.locale);
            } else {
              this._langAttrSetByTranslationTool = document.documentElement.lang;
            }
          } else {
            this._onLocaleChanged(document.documentElement.lang, mutation.oldValue || '');
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
    if (this._htmlLangAttributeObserver) {
      this._htmlLangAttributeObserver.disconnect();
    }
  }

  /**
   * @param {string} locale
   * @param {string} namespace
   */
  _isNamespaceInCache(locale, namespace) {
    return !!(this.__storage[locale] && this.__storage[locale][namespace]);
  }

  /**
   * @param {string} locale
   * @param {string} namespace
   */
  _getCachedNamespaceLoaderPromise(locale, namespace) {
    if (this.__namespaceLoaderPromisesCache[locale]) {
      return this.__namespaceLoaderPromisesCache[locale][namespace];
    }
    return null;
  }

  /**
   * @param {string} locale
   * @param {NamespaceObject} namespaceObj
   * @param {boolean} isDynamicImport
   * @param {string} namespace
   * @returns {Promise.<Object|void>}
   */
  _loadNamespaceData(locale, namespaceObj, isDynamicImport, namespace) {
    const loader = this._getNamespaceLoader(namespaceObj, isDynamicImport, namespace);
    const loaderPromise = this._getNamespaceLoaderPromise(loader, locale, namespace);
    this._cacheNamespaceLoaderPromise(locale, namespace, loaderPromise);
    return loaderPromise.then(
      /**
       * @param {Object} obj
       * @param {Object} obj.default
       */
      obj => {
        const data = isLocalizeESModule(obj) ? obj.default : obj;
        this.addData(locale, namespace, data);
      },
    );
  }

  /**
   * @param {NamespaceObject} namespaceObj
   * @param {boolean} isDynamicImport
   * @param {string} namespace
   * @throws {Error} Namespace shall setup properly. Check loader!
   */
  _getNamespaceLoader(namespaceObj, isDynamicImport, namespace) {
    let loader = this.__namespaceLoadersCache[namespace];
    if (!loader) {
      if (isDynamicImport) {
        const _namespaceObj = /** @type {Object.<string,function>} */ (namespaceObj);
        loader = _namespaceObj[namespace];
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

  /**
   * @param {function} loader
   * @param {string} locale
   * @param {string} namespace
   * @param {string} [fallbackLocale]
   * @returns {Promise.<any>}
   * @throws {Error} Data for namespace and (locale or fallback locale) could not be loaded.
   */
  _getNamespaceLoaderPromise(loader, locale, namespace, fallbackLocale = this._fallbackLocale) {
    return loader(locale, namespace).catch(() => {
      const lang = this._getLangFromLocale(locale);
      return loader(lang, namespace).catch(() => {
        if (fallbackLocale) {
          return this._getNamespaceLoaderPromise(loader, fallbackLocale, namespace, '').catch(
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

  /**
   * @param {string} locale
   * @param {string} namespace
   * @param {Promise.<Object>} promise
   */
  _cacheNamespaceLoaderPromise(locale, namespace, promise) {
    if (!this.__namespaceLoaderPromisesCache[locale]) {
      this.__namespaceLoaderPromisesCache[locale] = {};
    }
    this.__namespaceLoaderPromisesCache[locale][namespace] = promise;
  }

  /**
   * @param {string} namespace
   * @returns {function|null}
   */
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

  /**
   * @param {string} locale
   * @returns {string}
   */
  // eslint-disable-next-line class-methods-use-this
  _getLangFromLocale(locale) {
    return locale.substring(0, 2);
  }

  /**
   * @param {string} type
   * @param {EventListener} listener
   * @param {...Object} options
   */
  addEventListener(type, listener, ...options) {
    this.__delegationTarget.addEventListener(type, listener, ...options);
  }

  /**
   * @param {string} type
   * @param {EventListener} listener
   * @param {...Object} options
   */
  removeEventListener(type, listener, ...options) {
    this.__delegationTarget.removeEventListener(type, listener, ...options);
  }

  /**
   *  @param {CustomEvent} event
   */
  dispatchEvent(event) {
    this.__delegationTarget.dispatchEvent(event);
  }

  /**
   * @param {string} newLocale
   * @param {string} oldLocale
   * @returns {undefined}
   */
  _onLocaleChanged(newLocale, oldLocale) {
    if (newLocale === oldLocale) {
      return;
    }
    if (this._autoLoadOnLocaleChange) {
      this._loadAllMissing(newLocale, oldLocale);
    }
    this.dispatchEvent(new CustomEvent('localeChanged', { detail: { newLocale, oldLocale } }));
  }

  /**
   * @param {string} newLocale
   * @param {string} oldLocale
   * @returns {Promise.<Object>}
   */
  _loadAllMissing(newLocale, oldLocale) {
    const oldLocaleNamespaces = this.__storage[oldLocale] || {};
    const newLocaleNamespaces = this.__storage[newLocale] || {};
    /** @type {Promise<Object|void>[]} */
    const promises = [];
    Object.keys(oldLocaleNamespaces).forEach(namespace => {
      const newNamespaceData = newLocaleNamespaces[namespace];
      if (!newNamespaceData) {
        promises.push(
          this.loadNamespace(namespace, {
            locale: newLocale,
          }),
        );
      }
    });
    return Promise.all(promises);
  }

  /**
   * @param {string | string[]} keys
   * @param {string} locale
   * @returns {string | undefined}
   */
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

  /**
   * @param {string | undefined} key
   * @param {string} locale
   * @returns {string}
   * @throws {Error} `key`is missing namespace. The format for `key` is "namespace:name"
   *
   */
  _getMessageForKey(key, locale) {
    if (!key || key.indexOf(':') === -1) {
      throw new Error(
        `Namespace is missing in the key "${key}". The format for keys is "namespace:name".`,
      );
    }
    const [ns, namesString] = key.split(':');
    const namespaces = this.__storage[locale];
    const messages = namespaces ? namespaces[ns] : {};
    const names = namesString.split('.');
    const result = names.reduce(
      /**
       * @param {Object.<string, any> | string} message
       * @param {string} name
       * @returns {string}
       */
      (message, name) => (typeof message === 'object' ? message[name] : message),
      messages,
    );

    return String(result || '');
  }
}
