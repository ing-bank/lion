import { dedupeMixin } from '@lion/core';

export const RegistrationParentMixin = dedupeMixin(superclass =>
  // eslint-disable-next-line no-shadow
  class RegistrationParentMixin extends superclass {
    // TODO: this (if needed at all should be added in layers above)
    get formElementsArray() {
      return this.formElements;
    }

    constructor() {
      super();
      this.formElements = [];
      this.addEventListener('form-element-register', ({ target }) => this._registerChild(target));
      this.registrationReady = new Promise(resolve => {
        this.__resolveRegistrationReady = resolve;
      });
    }

    _registerChild(addEl) {
      this.formElements.push(addEl);
      addEl.__parentFormGroup = this; // eslint-disable-line no-param-reassign

      this._onChildRegistered(addEl);
      // TODO: this mixin should no nothing about modelValues. Call the hook in a layer that
      // is allowed to know. Also, elements that are registered lazily should NOT
      // completely reset the parentFormGroupArray, but only update for the new value
      // this. ();
    }

    _unregisterChild(removeEl) {
      const index = this.formElements.indexOf(removeEl);
      if (index > -1) {
        this.formElements.splice(index, 1);
      }
      this._onChildRegistered(removeEl);
    }

    _onChildRegistered(addEl) {} // eslint-disable-line

    _onChildUnRegistered(removeEl) {} // eslint-disable-line

    connectedCallback() {
      if(super.connectedCallback) {
        super.connectedCallback();
      }
      setTimeout(() => {
        this.__resolveRegistrationReady();
      });
    }
  }
);