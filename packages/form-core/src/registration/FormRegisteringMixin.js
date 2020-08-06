import { dedupeMixin } from '@lion/core';

/**
 * @typedef {import('../../types/registration/FormRegisteringMixinTypes').FormRegisteringMixin} FormRegisteringMixin
 */

/**
 * #FormRegisteringMixin:
 *
 * This Mixin registers a form element to a Registrar
 *
 * @type {FormRegisteringMixin}
 */
const FormRegisteringMixinImplementation = superclass =>
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
  };

export const FormRegisteringMixin = dedupeMixin(FormRegisteringMixinImplementation);
