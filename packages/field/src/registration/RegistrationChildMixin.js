import { dedupeMixin, LitPatchShadyMixin } from '@lion/core';

export const RegistrationChildMixin = dedupeMixin(superclass =>
  // eslint-disable-next-line no-shadow
  class RegistrationChildMixin extends LitPatchShadyMixin(superclass) {
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
        this.__parentFormGroup.removeChild(this);
      }
    }
  }
);
