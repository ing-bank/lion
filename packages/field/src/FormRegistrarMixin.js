import { dedupeMixin } from '@lion/core';
import { formRegistrarManager } from './formRegistrarManager.js';
import { FormRegisteringMixin } from './FormRegisteringMixin.js';

/**
 * This allows an element to become the manager of a register
 */
export const FormRegistrarMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line no-shadow, no-unused-vars
    class FormRegistrarMixin extends FormRegisteringMixin(superclass) {
      get formElements() {
        return this.__formElements;
      }

      set formElements(value) {
        this.__formElements = value;
      }

      get formElementsArray() {
        return this.__formElements;
      }

      constructor() {
        super();
        this.formElements = [];
        this.__readyForRegistration = false;
        this.__hasBeenRendered = false;
        this.registrationReady = new Promise(resolve => {
          this.__resolveRegistrationReady = resolve;
        });

        this._onRequestToAddFormElement = this._onRequestToAddFormElement.bind(this);
        this.addEventListener('form-element-register', this._onRequestToAddFormElement);
      }

      connectedCallback() {
        if (super.connectedCallback) {
          super.connectedCallback();
        }
        formRegistrarManager.add(this);
        if (this.__hasBeenRendered) {
          formRegistrarManager.becomesReady();
        }
      }

      disconnectedCallback() {
        if (super.disconnectedCallback) {
          super.disconnectedCallback();
        }
        formRegistrarManager.remove(this);
      }

      isRegisteredFormElement(el) {
        return this.formElementsArray.some(exitingEl => exitingEl === el);
      }

      firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        this.__resolveRegistrationReady();
        this.__readyForRegistration = true;
        formRegistrarManager.becomesReady();
        this.__hasBeenRendered = true;
      }

      addFormElement(child, index) {
        // This is a way to let the child element (a lion-fieldset or lion-field) know, about its parent
        // eslint-disable-next-line no-param-reassign
        child.__parentFormGroup = this;

        if (index > 0) {
          this.formElements.splice(index, 0, child);
        } else {
          this.formElements.push(child);
        }
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

        // Check for siblings to determine the right order to insert into formElements
        // If there is no next sibling, index is -1
        let indexToInsertAt = -1;
        if (this.formElements && Array.isArray(this.formElements)) {
          indexToInsertAt = this.formElements.indexOf(child.nextElementSibling);
        }
        this.addFormElement(child, indexToInsertAt);
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
    },
);
