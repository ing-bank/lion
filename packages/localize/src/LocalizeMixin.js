import { dedupeMixin, until, nothing } from '@lion/core';
import { localize } from './localize.js';

/**
 * @typedef {import('../types/LocalizeMixinTypes').LocalizeMixin} LocalizeMixin
 * @typedef {import('../types/LocalizeMixinTypes').NamespaceLocaleMap} NamespaceLocaleMap
 */

/**
 * # LocalizeMixin - for self managed templates
 * @type {LocalizeMixin}
 */
const LocalizeMixinImplementation = superclass =>
  // eslint-disable-next-line
  class LocalizeMixin extends superclass {
    /**
     * @returns {Array<NamespaceLocaleMap>}
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

      this.__boundLocalizeOnLocaleChanged =
        /** @param {...Object} args */
        (...args) => {
          const event = /** @type {CustomEvent} */ (Array.from(args)[0]);
          this.__localizeOnLocaleChanged(event);
        };

      // should be loaded in advance
      this.__localizeStartLoadingNamespaces();
      this.localizeNamespacesLoaded.then(() => {
        this.__localizeMessageSync = true;
      });
    }

    /**
     * hook into LitElement to only render once all translations are loaded
     * @returns {Promise<void>}
     */
    async performUpdate() {
      if (Object.getPrototypeOf(this).constructor.waitForLocalizeNamespaces) {
        await this.localizeNamespacesLoaded;
      }
      super.performUpdate();
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }

      this.localizeNamespacesLoaded.then(() => this.onLocaleReady());
      this.__localizeAddLocaleChangedListener();
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }

      this.__localizeRemoveLocaleChangedListener();
    }

    /**
     * @param {...string} args
     * @returns {string | Function }
     */
    msgLit(...args) {
      if (this.__localizeMessageSync) {
        return localize.msg(...args);
      }
      return until(
        this.localizeNamespacesLoaded.then(() => localize.msg(...args)),
        nothing,
      );
    }

    /**
     * @returns {Array<string>}
     */
    __getUniqueNamespaces() {
      /** @type {Array<string>} */
      const uniqueNamespaces = [];

      // IE11 does not support iterable in the constructor
      const s = new Set();
      Object.getPrototypeOf(this).constructor.localizeNamespaces.forEach(s.add.bind(s));
      s.forEach(uniqueNamespace => {
        uniqueNamespaces.push(uniqueNamespace);
      });
      return uniqueNamespaces;
    }

    __localizeStartLoadingNamespaces() {
      this.localizeNamespacesLoaded = localize.loadNamespaces(this.__getUniqueNamespaces());
    }

    __localizeAddLocaleChangedListener() {
      localize.addEventListener('localeChanged', this.__boundLocalizeOnLocaleChanged);
    }

    __localizeRemoveLocaleChangedListener() {
      localize.removeEventListener('localeChanged', this.__boundLocalizeOnLocaleChanged);
    }

    /**
     * @param {CustomEvent} event
     */
    __localizeOnLocaleChanged(event) {
      // FIXME: Expected 0 arguments, but got 2.ts(2554)
      this.onLocaleChanged(event.detail.newLocale, event.detail.oldLocale);
    }

    onLocaleReady() {
      this.onLocaleUpdated();
    }

    onLocaleChanged() {
      this.__localizeStartLoadingNamespaces();
      this.onLocaleUpdated();
      this.requestUpdate();
    }

    // eslint-disable-next-line class-methods-use-this
    onLocaleUpdated() {}
  };

export const LocalizeMixin = dedupeMixin(LocalizeMixinImplementation);
