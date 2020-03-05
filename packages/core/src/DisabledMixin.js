import { dedupeMixin } from '@open-wc/dedupe-mixin';

/**
 * #DisabledMixin
 *
 * @polymerMixin
 * @mixinFunction
 */
export const DisabledMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line no-shadow
    class DisabledMixin extends superclass {
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
        this.__requestedToBeDisabled = false;
        this.__isUserSettingDisabled = true;

        this.__restoreDisabledTo = false;
        this.disabled = false;
      }

      makeRequestToBeDisabled() {
        if (this.__requestedToBeDisabled === false) {
          this.__requestedToBeDisabled = true;
          this.__restoreDisabledTo = this.disabled;
          this.__internalSetDisabled(true);
        }
      }

      retractRequestToBeDisabled() {
        if (this.__requestedToBeDisabled === true) {
          this.__requestedToBeDisabled = false;
          this.__internalSetDisabled(this.__restoreDisabledTo);
        }
      }

      __internalSetDisabled(value) {
        this.__isUserSettingDisabled = false;
        this.disabled = value;
        this.__isUserSettingDisabled = true;
      }

      _requestUpdate(name, oldValue) {
        super._requestUpdate(name, oldValue);
        if (name === 'disabled') {
          if (this.__isUserSettingDisabled) {
            this.__restoreDisabledTo = this.disabled;
          }
          if (this.disabled === false && this.__requestedToBeDisabled === true) {
            this.__internalSetDisabled(true);
          }
        }
      }
    },
);
