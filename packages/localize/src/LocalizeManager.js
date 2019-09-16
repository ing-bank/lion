/* eslint-disable max-classes-per-file */

import MessageFormat from '@bundled-es-modules/message-format/MessageFormat.js';
import { LionSingleton } from '@lion/core';
import isLocalizeESModule from './isLocalizeESModule.js';

/**
 * Very lightweight message formatter.
 * It supports 'key replacement' formatting
 */
class MessageFormatLite {
  constructor(message) {
    this.message = message;
  }

  /**
   * @desc key replacement formatter (supports nested keys)
   * - from:
   *   - message: 'replace {key} to {obj.k}'
   *   - vars: {key: 'val' obj: {k: 'nestedVal'}}
   * - to: 'replace val to nestedVal'
   * @param {object} vars key value map of variables to be replaced
   */
  format(vars) {
    if (!vars) {
      return this.message;
    }
    let result = this.message;
    const varsKeys = Object.keys(vars);
    const messageKeys = this.message.match(/\{.*?\}/gm) || []; // gets ['{key}', '{obj.k}']
    messageKeys.forEach(keyWithAccolades => {
      const k = keyWithAccolades.slice(1,-1);
      if (varsKeys.includes(k)) { // if '{key}'
        result = result.replace(`${keyWithAccolades}`, vars[k]);
      } else if (k.includes('.')) { // if '{obj.k}'
        const pathKeys = k.split('.');
        const /** @type {string} */ replacement = pathKeys.reduce((res, acc) => res[acc], vars);
        result = result.replace(`${keyWithAccolades}`, replacement);
      }
    });
    return result;
  }
}

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
  }

  teardown() {
    this._teardownHtmlLangAttributeObserver();
  }

  // eslint-disable-next-line class-methods-use-this
  get locale() {
    return document.documentElement.lang;
  }

  set locale(value) {
    const oldLocale = document.documentElement.lang;

    this._teardownHtmlLangAttributeObserver();
    document.documentElement.lang = value;
    this._setupHtmlLangAttributeObserver();

    if (!value.includes('-')) {
      console.warn(`
        Locale was set to ${value}.
        Language only locales are deprecated, please use the full language locale e.g. 'en-GB' instead of 'en'.
        See https://github.com/ing-bank/lion/issues/187 for more information.
      `);
    }

    this._onLocaleChanged(value, oldLocale);
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

    let formatter;
    if (opts.rich) {
      formatter = new MessageFormat(message, locale);
    } else {
      formatter = new MessageFormatLite(message);
    }
    return formatter.format(vars);
  }

  _setupHtmlLangAttributeObserver() {
    if (!this._htmlLangAttributeObserver) {
      this._htmlLangAttributeObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          this._onLocaleChanged(document.documentElement.lang, mutation.oldValue);
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

  // TODO: this method has to be removed when EventTarget polyfill is available on IE11
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
    this.dispatchEvent(new CustomEvent('localeChanged', { detail: { newLocale, oldLocale } }));
    if (this._autoLoadOnLocaleChange) {
      this._loadAllMissing(newLocale, oldLocale);
    }
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
