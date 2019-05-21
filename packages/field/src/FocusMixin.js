import { dedupeMixin, DelegateMixin } from '@lion/core';

export const FocusMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line no-unused-vars, max-len, no-shadow
    class FocusMixin extends DelegateMixin(superclass) {
      get delegations() {
        return {
          ...super.delegations,
          target: () => this.inputElement,
          events: [...super.delegations.events, 'focus', 'blur'], // since these events don't bubble
          methods: [...super.delegations.methods, 'focus', 'blur'],
          properties: [...super.delegations.properties, 'onfocus', 'onblur', 'autofocus'],
          attributes: [...super.delegations.attributes, 'onfocus', 'onblur', 'autofocus'],
        };
      }

      connectedCallback() {
        super.connectedCallback();
        this._onFocus = this._onFocus.bind(this);
        this._onBlur = this._onBlur.bind(this);
        this.inputElement.addEventListener('focusin', this._onFocus);
        this.inputElement.addEventListener('focusout', this._onBlur);
      }

      disconnectedCallback() {
        super.disconnectedCallback();
        this.inputElement.removeEventListener('focusin', this._onFocus);
        this.inputElement.removeEventListener('focusout', this._onBlur);
      }

      /**
       * Helper Function to easily check if the element is being focused
       *
       * TODO: performance comparision vs
       *   return this.inputElement === document.activeElement;
       */
      get focused() {
        return this.hasAttribute('state-focused');
      }

      _onFocus() {
        if (super._onFocus) super._onFocus();
        this.setAttribute('state-focused', '');
      }

      _onBlur() {
        if (super._onBlur) super._onBlur();
        this.removeAttribute('state-focused');
      }
    },
);
