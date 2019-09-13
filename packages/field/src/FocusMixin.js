import { dedupeMixin } from '@lion/core';

export const FocusMixin = dedupeMixin(
  superclass =>
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
        const native = this.inputElement;
        if (native) {
          native.focus();
        }
      }

      blur() {
        const native = this.inputElement;
        if (native) {
          native.blur();
        }
      }

      updated(changedProperties) {
        super.updated(changedProperties);
        // 'state-focused' css classes are deprecated
        if (changedProperties.has('focused')) {
          this.classList[this.focused ? 'add' : 'remove']('state-focused');
        }
      }

      /**
       * Functions should be private
       *
       * @deprecated
       */
      _onFocus() {
        if (super._onFocus) {
          super._onFocus();
        }
        this.focused = true;
      }

      /**
       * Functions should be private
       *
       * @deprecated
       */
      _onBlur() {
        if (super._onBlur) {
          super._onBlur();
        }
        this.focused = false;
      }

      __registerEventsForFocusMixin() {
        // focus
        this.__redispatchFocus = ev => {
          ev.stopPropagation();
          this.dispatchEvent(new Event('focus'));
        };
        this.inputElement.addEventListener('focus', this.__redispatchFocus);

        // blur
        this.__redispatchBlur = ev => {
          ev.stopPropagation();
          this.dispatchEvent(new Event('blur'));
        };
        this.inputElement.addEventListener('blur', this.__redispatchBlur);

        // focusin
        this.__redispatchFocusin = ev => {
          ev.stopPropagation();
          this._onFocus(ev);
          this.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
        };
        this.inputElement.addEventListener('focusin', this.__redispatchFocusin);

        // focusout
        this.__redispatchFocusout = ev => {
          ev.stopPropagation();
          this._onBlur();
          this.dispatchEvent(new Event('focusout', { bubbles: true, composed: true }));
        };
        this.inputElement.addEventListener('focusout', this.__redispatchFocusout);
      }

      __teardownEventsForFocusMixin() {
        this.inputElement.removeEventListener('focus', this.__redispatchFocus);
        this.inputElement.removeEventListener('blur', this.__redispatchBlur);
        this.inputElement.removeEventListener('focusin', this.__redispatchFocusin);
        this.inputElement.removeEventListener('focusout', this.__redispatchFocusout);
      }
    },
);
