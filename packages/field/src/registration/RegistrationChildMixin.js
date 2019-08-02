import { dedupeMixin } from '@lion/core';

export const RegistrationChildMixin = dedupeMixin(superclass =>
  // eslint-disable-next-line no-shadow
  class RegistrationChildMixin extends superclass {
    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      this.dispatchEvent(new CustomEvent('form-element-register', { bubbles: true, composed: true }));
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
      if (this.__parentFormGroup) {
        this.__parentFormGroup._unregisterChild(this);
      }
    }
  }
);