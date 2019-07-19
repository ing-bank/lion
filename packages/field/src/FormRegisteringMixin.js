import { dedupeMixin } from '@lion/core';
import { formRegistrarManager } from './formRegistrarManager.js';

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
        this.__setupRegistrationHook();
      }

      disconnectedCallback() {
        if (super.disconnectedCallback) {
          super.disconnectedCallback();
        }
        this._unregisterFormElement();
      }

      __setupRegistrationHook() {
        if (formRegistrarManager.ready) {
          this._registerFormElement();
        } else {
          formRegistrarManager.addEventListener('all-forms-open-for-registration', () => {
            this._registerFormElement();
          });
        }
      }

      _registerFormElement() {
        this._dispatchRegistration();
        this._requestParentFormGroupUpdateOfResetModelValue();
      }

      _dispatchRegistration() {
        this.dispatchEvent(
          new CustomEvent('form-element-register', {
            detail: { element: this },
            bubbles: true,
          }),
        );
      }

      _unregisterFormElement() {
        if (this.__parentFormGroup) {
          this.__parentFormGroup.removeFormElement(this);
        }
      }

      /**
       * Makes sure our parentFormGroup has the most up to date resetModelValue
       * FormGroups will call the same on their parentFormGroup so the full tree gets the correct
       * values.
       */
      _requestParentFormGroupUpdateOfResetModelValue() {
        if (this.__parentFormGroup && this.__parentFormGroup._updateResetModelValue) {
          this.__parentFormGroup._updateResetModelValue();
        }
      }
    },
);
