import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { DisabledMixin } from './DisabledMixin.js';

/**
 * #DisabledWithTabIndexMixin
 *
 * @polymerMixin
 * @mixinFunction
 */
export const DisabledWithTabIndexMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line no-shadow
    class DisabledWithTabIndexMixin extends DisabledMixin(superclass) {
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
        this.__isUserSettingTabIndex = true;

        this.__restoreTabIndexTo = 0;
        this.__internalSetTabIndex(0);
      }

      makeRequestToBeDisabled() {
        super.makeRequestToBeDisabled();
        if (this.__requestedToBeDisabled === false) {
          this.__restoreTabIndexTo = this.tabIndex;
        }
      }

      retractRequestToBeDisabled() {
        super.retractRequestToBeDisabled();
        if (this.__requestedToBeDisabled === true) {
          this.__internalSetTabIndex(this.__restoreTabIndexTo);
        }
      }

      __internalSetTabIndex(value) {
        this.__isUserSettingTabIndex = false;
        this.tabIndex = value;
        this.__isUserSettingTabIndex = true;
      }

      _requestUpdate(name, oldValue) {
        super._requestUpdate(name, oldValue);

        if (name === 'disabled') {
          if (this.disabled) {
            this.__internalSetTabIndex(-1);
          } else {
            this.__internalSetTabIndex(this.__restoreTabIndexTo);
          }
        }

        if (name === 'tabIndex') {
          if (this.__isUserSettingTabIndex) {
            this.__restoreTabIndexTo = this.tabIndex;
          }

          if (this.tabIndex !== -1 && this.__requestedToBeDisabled === true) {
            this.__internalSetTabIndex(-1);
          }
        }
      }

      firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        // for ShadyDom the timing is a little different and we need to make sure
        // the tabindex gets correctly updated here
        if (this.disabled) {
          this.__internalSetTabIndex(-1);
        }
      }
    },
);
