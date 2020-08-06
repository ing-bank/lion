import { dedupeMixin } from '@lion/core';
/**
 * @typedef {import('../types/FocusMixinTypes').FocusMixin} FocusMixin
 * @type {FocusMixin}
 */
const FocusMixinImplementation = superclass =>
  // eslint-disable-next-line no-unused-vars, max-len, no-shadow
  class FocusMixin extends superclass {
    static get properties() {
      return {
        focused: {
          type: Boolean,
          reflect: true,
        },
      };
    }

    constructor() {
      super();
      this.focused = false;
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      this.__registerEventsForFocusMixin();
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
      this.__teardownEventsForFocusMixin();
    }

    focus() {
      const native = this._inputNode;
      if (native) {
        native.focus();
      }
    }

    blur() {
      const native = this._inputNode;
      if (native) {
        native.blur();
      }
    }

    __onFocus() {
      this.focused = true;
    }

    __onBlur() {
      this.focused = false;
    }

    __registerEventsForFocusMixin() {
      /**
       * focus
       * @param {Event} ev
       */
      this.__redispatchFocus = ev => {
        ev.stopPropagation();
        this.dispatchEvent(new Event('focus'));
      };
      this._inputNode.addEventListener('focus', this.__redispatchFocus);

      /**
       * blur
       * @param {Event} ev
       */
      this.__redispatchBlur = ev => {
        ev.stopPropagation();
        this.dispatchEvent(new Event('blur'));
      };
      this._inputNode.addEventListener('blur', this.__redispatchBlur);

      /**
       * focusin
       * @param {Event} ev
       */
      this.__redispatchFocusin = ev => {
        ev.stopPropagation();
        this.__onFocus();
        this.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
      };
      this._inputNode.addEventListener('focusin', this.__redispatchFocusin);

      /**
       * focusout
       * @param {Event} ev
       */
      this.__redispatchFocusout = ev => {
        ev.stopPropagation();
        this.__onBlur();
        this.dispatchEvent(new Event('focusout', { bubbles: true, composed: true }));
      };
      this._inputNode.addEventListener('focusout', this.__redispatchFocusout);
    }

    __teardownEventsForFocusMixin() {
      this._inputNode.removeEventListener('focus', this.__redispatchFocus);
      this._inputNode.removeEventListener('blur', this.__redispatchBlur);
      this._inputNode.removeEventListener('focusin', this.__redispatchFocusin);
      this._inputNode.removeEventListener('focusout', this.__redispatchFocusout);
    }
  };

export const FocusMixin = dedupeMixin(FocusMixinImplementation);
