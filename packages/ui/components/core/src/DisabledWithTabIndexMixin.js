import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { DisabledMixin } from './DisabledMixin.js';

/**
 * @typedef {import('../types/DisabledWithTabIndexMixinTypes.js').DisabledWithTabIndexMixin} DisabledWithTabIndexMixin
 */

/**
 * @type {DisabledWithTabIndexMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('lit').LitElement>} superclass
 */
const DisabledWithTabIndexMixinImplementation = superclass =>
  // eslint-disable-next-line no-shadow
  // @ts-ignore https://github.com/microsoft/TypeScript/issues/36821#issuecomment-588375051
  class extends DisabledMixin(superclass) {
    static get properties() {
      return {
        // we use a property here as if we use the native tabIndex we can not set a default value
        // in the constructor as it synchronously sets the attribute which is not allowed in the
        // constructor phase
        tabIndex: {
          type: Number,
          reflect: true,
          attribute: 'tabindex',
        },
      };
    }

    constructor() {
      super();
      /** @private */
      this.__isUserSettingTabIndex = true;
      /** @private */
      this.__restoreTabIndexTo = 0;
      this.__internalSetTabIndex(0);
    }

    makeRequestToBeDisabled() {
      super.makeRequestToBeDisabled();
      if (this._requestedToBeDisabled === false && this.tabIndex != null) {
        this.__restoreTabIndexTo = this.tabIndex;
      }
    }

    retractRequestToBeDisabled() {
      super.retractRequestToBeDisabled();
      if (this._requestedToBeDisabled === true) {
        this.__internalSetTabIndex(this.__restoreTabIndexTo);
      }
    }

    /**
     * // TODO: check if this is a false positive or if we can improve
     * @configure ReactiveElement
     */
    // @ts-expect-error
    static enabledWarnings = super.enabledWarnings?.filter(w => w !== 'change-in-update') || [];

    /**
     * @param {number} value
     * @private
     */
    __internalSetTabIndex(value) {
      this.__isUserSettingTabIndex = false;
      this.tabIndex = value;
      this.__isUserSettingTabIndex = true;
    }

    /**
     * @param {string} [name]
     * @param {unknown} [oldValue]
     * @param {import('lit').PropertyDeclaration} [options]
     * @returns {void}
     */
    requestUpdate(name, oldValue, options) {
      super.requestUpdate(name, oldValue, options);

      if (name === 'disabled') {
        if (this.disabled) {
          this.__internalSetTabIndex(-1);
        } else {
          this.__internalSetTabIndex(this.__restoreTabIndexTo);
        }
      }

      if (name === 'tabIndex') {
        if (this.__isUserSettingTabIndex && this.tabIndex != null) {
          this.__restoreTabIndexTo = this.tabIndex;
        }

        if (this.tabIndex !== -1 && this._requestedToBeDisabled === true) {
          this.__internalSetTabIndex(-1);
        }
      }
    }

    /** @param {import('lit-element').PropertyValues } changedProperties */
    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
      // for ShadyDom the timing is a little different and we need to make sure
      // the tabindex gets correctly updated here
      if (this.disabled) {
        this.__internalSetTabIndex(-1);
      }
    }
  };

export const DisabledWithTabIndexMixin = dedupeMixin(DisabledWithTabIndexMixinImplementation);
