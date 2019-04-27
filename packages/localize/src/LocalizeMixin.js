import { dedupeMixin, until, nothing } from '@lion/core';
import { localize } from './localize.js';

/**
 * # LocalizeMixin - for self managed templates
 *
 * @polymerMixin
 * @mixinFunction
 */
export const LocalizeMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line
    class LocalizeMixin extends superclass {
      static get localizeNamespaces() {
        return [];
      }

      static get waitForLocalizeNamespaces() {
        return true;
      }

      constructor() {
        super();

        this.__boundLocalizeOnLocaleChanged = (...args) => this.__localizeOnLocaleChanged(...args);

        // should be loaded in advance
        this.__localizeStartLoadingNamespaces();
        this.localizeNamespacesLoaded.then(() => {
          this.__localizeMessageSync = true;
        });
      }

      /**
       * hook into LitElement to only render once all translations are loaded
       */
      async performUpdate() {
        if (this.constructor.waitForLocalizeNamespaces) {
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

      msgLit(...args) {
        if (this.__localizeMessageSync) {
          return localize.msg(...args);
        }
        return until(this.localizeNamespacesLoaded.then(() => localize.msg(...args)), nothing);
      }

      __getUniqueNamespaces() {
        const uniqueNamespaces = [];

        // IE11 does not support iterable in the constructor
        const s = new Set();
        this.constructor.localizeNamespaces.forEach(s.add.bind(s));
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

      __localizeOnLocaleChanged(event) {
        this.onLocaleChanged(event.detail.newLocale, event.detail.oldLocale);
      }

      onLocaleReady() {
        this.onLocaleUpdated();
      }

      onLocaleChanged() {
        this.localizeNamespacesLoaded = localize.loadNamespaces(this.__getUniqueNamespaces());
        this.onLocaleUpdated();
        this.requestUpdate();
      }

      // eslint-disable-next-line class-methods-use-this
      onLocaleUpdated() {}
    },
);
