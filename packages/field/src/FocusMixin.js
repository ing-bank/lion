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

      get events() {
        return {
          ...super.events,
          // Listen to focusin instead of focus, because it blurs
          _onFocus: [() => this.inputElement, 'focusin'],
          _onBlur: [() => this.inputElement, 'focusout'],
        };
      }

      /**
       * Helper Function to easily check if the element is being focused
       *
       * TODO: performance comparision vs
       *   return this.inputElement === document.activeElement;
       */
      get focused() {
        return this.classList.contains('state-focused');
      }

      _onFocus() {
        if (super._onFocus) super._onFocus();
        this.classList.add('state-focused');
      }

      _onBlur() {
        if (super._onBlur) super._onBlur();
        this.classList.remove('state-focused');
      }
    },
);
