import { dedupeMixin } from '@lion/core';

/**
 * #FormRegisteringMixin:
 *
 * This Mixin registers a form element to a Registrar
 *
 * @polymerMixin
 * @mixinFunction
 */
export const FormRegisteringMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line no-shadow, no-unused-vars
    class FormRegisteringMixin extends superclass {
      connectedCallback() {
        if (super.connectedCallback) {
          super.connectedCallback();
        }
        this.dispatchEvent(
          new CustomEvent('form-element-register', {
            detail: { element: this },
            bubbles: true,
          }),
        );
      }

      disconnectedCallback() {
        if (super.disconnectedCallback) {
          super.disconnectedCallback();
        }
        if (this.__parentFormGroup) {
          this.__parentFormGroup.removeFormElement(this);
        }
      }
    },
);
