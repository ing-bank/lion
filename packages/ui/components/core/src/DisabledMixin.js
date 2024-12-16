import { dedupeMixin } from '@open-wc/dedupe-mixin';

/**
 * @typedef {import('../types/DisabledMixinTypes.js').DisabledMixin} DisabledMixin
 */

/**
 * @type {DisabledMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('lit').LitElement>} superclass
 */
const DisabledMixinImplementation = superclass =>
  // eslint-disable-next-line no-shadow
  // @ts-ignore https://github.com/microsoft/TypeScript/issues/36821#issuecomment-588375051
  class extends superclass {
    static get properties() {
      return {
        disabled: {
          type: Boolean,
          reflect: true,
        },
      };
    }

    constructor() {
      super();
      /** @protected */
      this._requestedToBeDisabled = false;
      /** @private */
      this.__isUserSettingDisabled = true;
      /** @private */
      this.__restoreDisabledTo = false;
      this.disabled = false;
    }

    makeRequestToBeDisabled() {
      if (this._requestedToBeDisabled === false) {
        this._requestedToBeDisabled = true;
        this.__restoreDisabledTo = this.disabled;
        this.__internalSetDisabled(true);
      }
    }

    retractRequestToBeDisabled() {
      if (this._requestedToBeDisabled === true) {
        this._requestedToBeDisabled = false;
        this.__internalSetDisabled(this.__restoreDisabledTo);
      }
    }

    /**
     * @param {boolean} value
     * @private
     */
    __internalSetDisabled(value) {
      this.__isUserSettingDisabled = false;
      this.disabled = value;
      this.__isUserSettingDisabled = true;
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
        if (this.__isUserSettingDisabled) {
          this.__restoreDisabledTo = this.disabled;
        }
        if (this.disabled === false && this._requestedToBeDisabled === true) {
          this.__internalSetDisabled(true);
        }
      }
    }

    click() {
      if (this.disabled) return;

      super.click();
    }
  };

export const DisabledMixin = dedupeMixin(DisabledMixinImplementation);
