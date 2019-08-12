import { dedupeMixin, LitPatchShadyMixin } from '@lion/core';

export const RegistrationParentMixin = dedupeMixin(superclass =>
  // eslint-disable-next-line no-shadow
  class RegistrationParentMixin extends LitPatchShadyMixin(superclass) {

    get formElementsArray() {
      return this.formElements;
    }

    constructor() {
      super();
      this.formElements = [];
      this.addEventListener('form-element-register', this._onRequestToAddFormElement);
      this.registrationReady = new Promise(resolve => {
        this.__resolveRegistrationReady = resolve;
      });
    }

    connectedCallback() {
      if(super.connectedCallback) {
        super.connectedCallback();
      }
      setTimeout(() => {
        this.__resolveRegistrationReady();
      });
    }

    addFormElement(child) {
      // This is a way to let the child element (a lion-fieldset or lion-field) know, about its parent
      // eslint-disable-next-line no-param-reassign
      child.__parentFormGroup = this;
      this.formElements.push(child);
    }

    removeFormElement(child) {
      const index = this.formElements.indexOf(child);
      if (index > -1) {
        this.formElements.splice(index, 1);
      }
    }

    _onRequestToAddFormElement(ev) {
      const child = ev.detail.element;
      if (child === this) {
        // as we fire and listen - don't add ourselves
        return;
      }
      if (this.isRegisteredFormElement(child)) {
        // do not readd already existing elements
        return;
      }
      ev.stopPropagation();
      this.addFormElement(child);
    }

    isRegisteredFormElement(el) {
      return this.formElementsArray.some(exitingEl => exitingEl === el);
    }
  }
);
