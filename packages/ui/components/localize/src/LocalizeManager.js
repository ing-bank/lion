// @ts-expect-error
import MessageFormat from '@bundled-es-modules/message-format/MessageFormat.js';
import { isServer } from 'lit';

import isLocalizeESModule from './isLocalizeESModule.js';

/**
 * @typedef {import('../types/LocalizeMixinTypes.js').NumberPostProcessor} NumberPostProcessor
 * @typedef {import('../types/LocalizeMixinTypes.js').DatePostProcessor} DatePostProcessor
 * @typedef {import('../types/LocalizeMixinTypes.js').NamespaceObject} NamespaceObject
 */

/**
 * We can't access `window.document.documentElement` on the server,
 * so we write to and read from this object on the server.
 * N.B.: for now, the goal is to make LocalizeManager not crash on the server, and let localization happen on the client.
 * In the future, we might want to look into more advanced SSR of localized messages
 */
const documentElement = isServer
  ? { getAttribute: () => null, lang: '' }
  : globalThis.document?.documentElement;

/**
 * `LocalizeManager` manages your translations (includes loading)
 */
export class LocalizeManager extends EventTarget {
  /**
   * The localize system uses (normalized) Intl for formatting numbers.
   * It's possible to customize this output per locale
   */
  formatNumberOptions = {
    returnIfNaN: '',
    /** @type {Map<string, NumberPostProcessor>} */
    postProcessors: new Map(),
  };

  /**
   * The localize system uses (normalized) Intl for formatting dates.
   * It's possible to customize this output per locale
   */
  formatDateOptions = {
    /** @type {Map<string, DatePostProcessor>} */
    postProcessors: new Map(),
  };

  /**
   * Although it's common to configure the language via the html[lang] attribute,
   * the lang attribute can be changed by 3rd party translation tools like Google Translate.
   *
   * ## Why is this a potential problem?
   * The localize system reads from html[lang] for its original configuration. Let's say it's
   * configured as "en-US" by the developer. This means all translation data are fetched for locale "en-US".
   *
   * Now the Google Translate plugin kicks in. It will automatically translate all English texts found into
   * Chinese texts. Everything looks fine... But Google Translate also sets html[lang] to "zh-CN":
   * our localize system responds by trying to fetch Chinese translation data.
   * Two problems can occur here:
   * - the Chinese translations don't exist
   * - Google Translate expects to translate from English to Chinese... and now we suddenly serve Chinese text
   * ourselves... not what we intended.
   *
   * ## How can we solve this?
   * Via `html[data-localize-lang]`, developers are allowed to set the initial locale, without
   * having to worry about whether locale is initialized before 3rd parties like Google Translate.
   * When this value differs from html[lang], we assume the 3rd party took
   * control over the page language and we set this.#localeSetByTranslationTool to html[lang]
   */
  #shouldHandleTranslationTools = false;

  /**
   * The locale that is configured on html[data-localize-lang]
   */
  #localeProvidedViaDataLangAttr = '';

  /**
   * The locale that is set on html[lang] by a 3rd party translation tool like Googl Translate
   * @type {string|null}
   */
  #localeSetByTranslationTool = null;

  /**
   * @type {Object<string, Object<string, Object>>}
   * @private
   */
  __storage = {};

  /**
   * @type {Map<RegExp|string, function>}
   * @private
   */
  __namespacePatternsMap = new Map();

  /**
   * @type {Object<string, function|null>}
   * @private
   */
  __namespaceLoadersCache = {};

  /**
   * @type {Object<string, Object<string, Promise<Object|void>>>}
   * @private
   */
  __namespaceLoaderPromisesCache = {};

  /**
   * @returns {string}
   */
  get locale() {
    if (!this.#shouldHandleTranslationTools) {
      return documentElement.lang || '';
    }
    return this.#localeProvidedViaDataLangAttr || '';
  }

  /**
   * @param {string} newLocale
   */
  set locale(newLocale) {
    this.#assertCorrectLocale(newLocale);

    if (!this.#shouldHandleTranslationTools) {
      const oldLocale = documentElement.lang;
      this._setHtmlLangAttribute(newLocale);
      this._onLocaleChanged(newLocale, oldLocale);
      return;
    }

    const oldLocale = /** @type {string} */ (this.#localeProvidedViaDataLangAttr);
    this.#localeProvidedViaDataLangAttr = newLocale;
    const isLangAutoOrTranslationToolNotProcessed = this.#localeSetByTranslationTool === null;
    if (isLangAutoOrTranslationToolNotProcessed) {
      this._setHtmlLangAttribute(newLocale);
    }
    this._onLocaleChanged(newLocale, oldLocale);
  }

  /**
   * @readonly
   * @returns {Promise<Object|void>}
   */
  get loadingComplete() {
    const hasPendingCacheForLocale =
      typeof this.__namespaceLoaderPromisesCache[this.locale] === 'object';

    return !hasPendingCacheForLocale
      ? Promise.resolve()
      : Promise.all(Object.values(this.__namespaceLoaderPromisesCache[this.locale]));
  }

  constructor({
    allowOverridesForExistingNamespaces = false,
    autoLoadOnLocaleChange = false,
    showKeyAsFallback = false,
    fallbackLocale = '',
  } = {}) {
    super();

    /** @private */
    this.__allowOverridesForExistingNamespaces = allowOverridesForExistingNamespaces;
    /** @protected */
    this._autoLoadOnLocaleChange = !!autoLoadOnLocaleChange;
    /** @protected */
    this._showKeyAsFallback = showKeyAsFallback;
    /** @protected */
    this._fallbackLocale = fallbackLocale;

    const localeProvidedViaDataLangAttr = documentElement.getAttribute('data-localize-lang');
    this.#shouldHandleTranslationTools = Boolean(localeProvidedViaDataLangAttr);

    if (this.#shouldHandleTranslationTools) {
      this.locale = /** @type {string} */ (localeProvidedViaDataLangAttr);
      this._setupTranslationToolSupport();
    }

    if (!documentElement.lang) {
      documentElement.lang = this.locale || 'en-GB';
    }

    this._setupHtmlLangAttributeObserver();
  }

  /**
   * @param {string} locale
   * @param {string} namespace
   * @param {object} data
   * @throws {Error} Namespace can be added only once, for a given locale unless allowOverridesForExistingNamespaces
   * is set to `true`
   */
  addData(locale, namespace, data) {
    if (
      !this.__allowOverridesForExistingNamespaces &&
      this._isNamespaceInCache(locale, namespace)
    ) {
      throw new Error(
        `Namespace "${namespace}" has been already added for the locale "${locale}".`,
      );
    }

    this.__storage[locale] = this.__storage[locale] || {};

    if (this.__allowOverridesForExistingNamespaces) {
      this.__storage[locale][namespace] = {
        ...this.__storage[locale][namespace],
        ...data,
      };
    } else {
      this.__storage[locale][namespace] = data;
    }
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
   * @param {Object} options
   * @param {string} [options.locale]
   * @returns {Promise<Object>}
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
   * @param {Object} options
   * @param {string} [options.locale]
   * @returns {Promise<Object|void>}
   */
  loadNamespace(namespaceObj, { locale = this.locale } = { locale: this.locale }) {
    const isDynamicImport = typeof namespaceObj === 'object';

    const namespace = /** @type {string} */ (
      isDynamicImport ? Object.keys(namespaceObj)[0] : namespaceObj
    );

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
   * @param {Object<string,?>} [vars]
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
    // Ensure we convert to string for backwards compatibility
    const messageStr = typeof message === 'string' ? message : String(message);
    const formatter = new MessageFormat(messageStr, locale);
    return formatter.format(vars);
  }

  /**
   * Gets a message value that can be of any type (string, array, object).
   * Use this when you need to access structured translation data like arrays or objects.
   * For simple string messages with variable interpolation, use msg() instead.
   *
   * @param {string | string[]} keys
   * @param {Object} [opts]
   * @param {string} [opts.locale]
   * @returns {any}
   */
  msgList(keys, opts = {}) {
    const locale = opts.locale ? opts.locale : this.locale;
    const message = this._getMessageForKeys(keys, locale);
    return message !== undefined ? message : '';
  }

  teardown() {
    this._teardownHtmlLangAttributeObserver();
  }

  reset() {
    this.__storage = {};
    this.__namespacePatternsMap = new Map();
    this.__namespaceLoadersCache = {};
    this.__namespaceLoaderPromisesCache = {};
  }

  /**
   * @param {{locale:string, postProcessor:DatePostProcessor}} options
   */
  setDatePostProcessorForLocale({ locale, postProcessor }) {
    this.formatDateOptions?.postProcessors.set(locale, postProcessor);
  }

  /**
   * @param {{locale:string, postProcessor:NumberPostProcessor}} options
   */
  setNumberPostProcessorForLocale({ locale, postProcessor }) {
    this.formatNumberOptions?.postProcessors.set(locale, postProcessor);
  }

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
   * (by not altering html[lang]). We detect this by reading #localeSetByTranslationTool:
   * when its value is null, we consider Google translate 'not active'.
   *
   * When Google Translate is turned off by the user (html[lang=auto]),
   * `localize.locale` will be synced to html[lang] again
   *
   * Keep in mind that all of the above also works with other tools than Google Translate,
   * but this is the most widely used tool and therefore used as an example.
   * @protected
   */
  _setupTranslationToolSupport() {
    this.#localeSetByTranslationTool = documentElement.lang || null;
  }

  /**
   * @param {string} locale
   * @protected
   */
  _setHtmlLangAttribute(locale) {
    this._teardownHtmlLangAttributeObserver();
    documentElement.lang = locale;
    this._setupHtmlLangAttributeObserver();
  }

  /** @protected */
  _setupHtmlLangAttributeObserver() {
    if (isServer) return;

    if (!this._htmlLangAttributeObserver) {
      this._htmlLangAttributeObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (this.#shouldHandleTranslationTools) {
            if (documentElement.lang === 'auto') {
              // Google Translate is switched off
              this.#localeSetByTranslationTool = null;
              this._setHtmlLangAttribute(this.locale);
            } else {
              this.#localeSetByTranslationTool = document.documentElement.lang;
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

  /** @protected */
  _teardownHtmlLangAttributeObserver() {
    if (this._htmlLangAttributeObserver) {
      this._htmlLangAttributeObserver.disconnect();
    }
  }

  /**
   * @param {string} locale
   * @param {string} namespace
   * @protected
   */
  _isNamespaceInCache(locale, namespace) {
    return !!(this.__storage[locale] && this.__storage[locale][namespace]);
  }

  /**
   * @param {string} locale
   * @param {string} namespace
   * @protected
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
   * @returns {Promise<Object|void>}
   * @protected
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
        // add data only if we have the promise in cache
        if (
          this.__namespaceLoaderPromisesCache[locale] &&
          this.__namespaceLoaderPromisesCache[locale][namespace] === loaderPromise
        ) {
          const data = isLocalizeESModule(obj) ? obj.default : obj;
          this.addData(locale, namespace, data);
        }
      },
    );
  }

  /**
   * @param {NamespaceObject} namespaceObj
   * @param {boolean} isDynamicImport
   * @param {string} namespace
   * @throws {Error} Namespace shall setup properly. Check loader!
   * @protected
   */
  _getNamespaceLoader(namespaceObj, isDynamicImport, namespace) {
    let loader = this.__namespaceLoadersCache[namespace];
    if (!loader) {
      if (isDynamicImport) {
        const _namespaceObj = /** @type {Object<string,function>} */ (namespaceObj);
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
   * @returns {Promise<any>}
   * @throws {Error} Data for namespace and (locale or fallback locale) could not be loaded.
   * @protected
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
   * @param {Promise<Object|void>} promise
   * @protected
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
   * @protected
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
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _getLangFromLocale(locale) {
    return locale.substring(0, 2);
  }

  /**
   * @param {string} newLocale
   * @param {string} oldLocale
   * @returns {undefined}
   * @protected
   */
  _onLocaleChanged(newLocale, oldLocale) {
    // Event firing immediately, does not wait for loading the translations
    this.dispatchEvent(new CustomEvent('__localeChanging'));
    if (newLocale === oldLocale) return;

    if (this._autoLoadOnLocaleChange) {
      this._loadAllMissing(newLocale, oldLocale);
      this.loadingComplete.then(() => {
        this.dispatchEvent(new CustomEvent('localeChanged', { detail: { newLocale, oldLocale } }));
      });
    } else {
      this.dispatchEvent(new CustomEvent('localeChanged', { detail: { newLocale, oldLocale } }));
    }
  }

  /**
   * @param {string} newLocale
   * @param {string} oldLocale
   * @protected
   */
  _loadAllMissing(newLocale, oldLocale) {
    const oldLocaleNamespaces = this.__storage[oldLocale] || {};
    const newLocaleNamespaces = this.__storage[newLocale] || {};
    Object.keys(oldLocaleNamespaces).forEach(namespace => {
      const newNamespaceData = newLocaleNamespaces[namespace];
      if (!newNamespaceData) {
        this.loadNamespace(namespace, {
          locale: newLocale,
        });
      }
    });
  }

  /**
   * @param {string | string[]} keys
   * @param {string} locale
   * @returns {any}
   * @protected
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
      if (message !== undefined && message !== null && message !== '') {
        return message;
      }
    }
    return undefined;
  }

  /**
   * @param {string | undefined} key
   * @param {string} locale
   * @returns {any}
   * @throws {Error} `key`is missing namespace. The format for `key` is "namespace:name"
   * @protected
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
       * @param {Object<string, any> | string | any[]} message
       * @param {string} name
       * @returns {any}
       */
      (message, name) =>
        typeof message === 'object' && !Array.isArray(message) ? message[name] : message,
      messages,
    );

    if (result !== undefined && result !== null && result !== '') {
      return result;
    }

    return this._showKeyAsFallback ? key : '';
  }

  /**
   * @param {string} value
   * @throws {Error} Language only locales are not allowed(Use 'en-GB' instead of 'en')
   */
  // eslint-disable-next-line class-methods-use-this
  #assertCorrectLocale(value) {
    if (value.includes('-')) return;

    throw new Error(`
      Locale was set to ${value}.
      Language only locales are not allowed, please use the full language locale e.g. 'en-GB' instead of 'en'.
      See https://github.com/ing-bank/lion/issues/187 for more information.
    `);
  }

  // === TODO: delete below in a next breaking release ---

  /**
   * @deprecated
   * @protected
   */
  get _supportExternalTranslationTools() {
    return this.#shouldHandleTranslationTools;
  }

  /**
   * @deprecated
   * @protected
   */
  set _supportExternalTranslationTools(supportsThem) {
    this.#shouldHandleTranslationTools = supportsThem;
  }

  /**
   * @deprecated
   * @protected
   */
  get _langAttrSetByTranslationTool() {
    return this.#localeProvidedViaDataLangAttr;
  }

  /**
   * @deprecated
   * @protected
   */
  set _langAttrSetByTranslationTool(newValue) {
    this.#localeProvidedViaDataLangAttr = newValue;
  }
}
