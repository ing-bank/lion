import { dedupeMixin, LitPatchShadyMixin } from '@lion/core';

export const RegistrationParentMixin = dedupeMixin(superclass =>
  // eslint-disable-next-line no-shadow
  class RegistrationParentMixin extends LitPatchShadyMixin(superclass) {
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

    // _registerChild(addEl) {
    //   this.formElements.push(addEl);
    //   addEl.__parentFormGroup = this; // eslint-disable-line no-param-reassign

    //   this._onChildRegistered(addEl);
    //   // TODO: this mixin should know nothing about modelValues. Call the hook in a layer that
    //   // is allowed to know. Also, elements that are registered lazily should NOT
    //   // completely reset the parentFormGroupArray, but only update for the new value
    // }

    // _unregisterChild(removeEl) {
    //   const index = this.formElements.indexOf(removeEl);
    //   if (index > -1) {
    //     this.formElements.splice(index, 1);
    //   }
    //   this._onChildUnregistered(removeEl);
    // }

    // _onChildRegistered(addEl) {} // eslint-disable-line

    // _onChildUnRegistered(removeEl) {} // eslint-disable-line

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

      // TODO: registration mixin should have no knowledge about modelValues.
      // Make `.resetModelValue` a getter that fetches info from children, each of whom
      // hold reset state: https://web.dev/more-capable-form-controls#restoring-form-state
      this._updateResetModelValue();
    }

    removeFormElement(child) {
      const index = this.formElements.indexOf(child);
      if (index > -1) {
        this.formElements.splice(index, 1);
      }
      // TODO: registration mixin should have no knowledge about modelValues.
      this._updateResetModelValue();
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

    _onRequestToRemoveFormElement(ev) {
      const child = ev.detail.element;
      if (child === this) {
        // as we fire and listen - don't add ourselves
        return;
      }
      if (!this.isRegisteredFormElement(child)) {
        // do not readd already existing elements
        return;
      }
      ev.stopPropagation();

      this.removeFormElement(child);
    }

    isRegisteredFormElement(el) {
      return this.formElementsArray.some(exitingEl => exitingEl === el);
    }
  }
);
