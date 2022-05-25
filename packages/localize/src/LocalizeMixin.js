import { dedupeMixin, until, nothing } from '@lion/core';
import { localize } from './localize.js';

/**
 * @typedef {import('@lion/core').DirectiveResult} DirectiveResult
 * @typedef {import('../types/LocalizeMixinTypes').LocalizeMixin} LocalizeMixin
 */

/**
 * # LocalizeMixin - for self managed templates
 * @type {LocalizeMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('@lion/core').LitElement>} superclass
 */
const LocalizeMixinImplementation = superclass =>
  // @ts-ignore https://github.com/microsoft/TypeScript/issues/36821#issuecomment-588375051
  class LocalizeMixin extends superclass {
    /**
     * @returns {Object.<string,function>[]}
     */
    static get localizeNamespaces() {
      return [];
    }

    /**
     * @returns {boolean}
     */
    static get waitForLocalizeNamespaces() {
      return true;
    }

    constructor() {
      super();

      /** @private */
      this.__boundLocalizeOnLocaleChanged =
        /** @param {...Object} args */
        (...args) => {
          const event = /** @type {CustomEvent} */ (Array.from(args)[0]);
          this.__localizeOnLocaleChanged(event);
        };

      this.__boundLocalizeOnLocaleChanging =
        /** @param {...Object} args */
        () => {
          this.__localizeOnLocaleChanging();
        };

      // should be loaded in advance
      /** @private */
      this.__localizeStartLoadingNamespaces();

      if (this.localizeNamespacesLoaded) {
        this.localizeNamespacesLoaded.then(() => {
          /** @private */
          this.__localizeMessageSync = true;
        });
      }
    }

    /**
     * hook into LitElement to only render once all translations are loaded
     * @returns {Promise.<void>}
     */
    async performUpdate() {
      if (Object.getPrototypeOf(this).constructor.waitForLocalizeNamespaces) {
        await this.localizeNamespacesLoaded;
      }
      super.performUpdate();
    }

    connectedCallback() {
      super.connectedCallback();
      if (this.localizeNamespacesLoaded) {
        this.localizeNamespacesLoaded.then(() => this.onLocaleReady());
      }
      localize.addEventListener('__localeChanging', this.__boundLocalizeOnLocaleChanging);
      localize.addEventListener('localeChanged', this.__boundLocalizeOnLocaleChanged);
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      localize.removeEventListener('__localeChanging', this.__boundLocalizeOnLocaleChanging);
      localize.removeEventListener('localeChanged', this.__boundLocalizeOnLocaleChanged);
    }

    /**
     * @param {string | string[]} keys
     * @param {Object.<string,?>} [variables]
     * @param {Object} [options]
     * @param {string} [options.locale]
     * @returns {string | DirectiveResult}
     */
    msgLit(keys, variables, options) {
      if (this.__localizeMessageSync) {
        return localize.msg(keys, variables, options);
      }

      if (!this.localizeNamespacesLoaded) {
        return '';
      }

      return until(
        this.localizeNamespacesLoaded.then(() => localize.msg(keys, variables, options)),
        nothing,
      );
    }

    /**
     * @returns {string[]}
     * @private
     */
    __getUniqueNamespaces() {
      /** @type {string[]} */
      const uniqueNamespaces = [];

      // IE11 does not support iterable in the constructor
      const s = new Set();
      Object.getPrototypeOf(this).constructor.localizeNamespaces.forEach(s.add.bind(s));
      s.forEach(uniqueNamespace => {
        uniqueNamespaces.push(uniqueNamespace);
      });
      return uniqueNamespaces;
    }

    /** @private */
    __localizeStartLoadingNamespaces() {
      this.localizeNamespacesLoaded = localize.loadNamespaces(this.__getUniqueNamespaces());
    }

    /**
     * Start loading namespaces on the event that is sent immediately
     * when localize.locale changes --> 'localeChanging'
     * @private
     */
    __localizeOnLocaleChanging() {
      this.__localizeStartLoadingNamespaces();
    }

    /**
     * @param {CustomEvent} event
     * @private
     */
    __localizeOnLocaleChanged(event) {
      this.onLocaleChanged(event.detail.newLocale, event.detail.oldLocale);
    }

    onLocaleReady() {
      this.onLocaleUpdated();
    }

    /**
     * @param {string} newLocale
     * @param {string} oldLocale
     * @protected
     */
    // eslint-disable-next-line no-unused-vars
    onLocaleChanged(newLocale, oldLocale) {
      this.onLocaleUpdated();
      this.requestUpdate();
    }

    // eslint-disable-next-line class-methods-use-this
    onLocaleUpdated() {}
  };

export const LocalizeMixin = dedupeMixin(LocalizeMixinImplementation);
