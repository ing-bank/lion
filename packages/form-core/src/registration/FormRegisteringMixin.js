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
            composed: true,
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

      // update(changedProperties) {
      //   super.update(changedProperties);
      //   if (changedProperties.has('name')) {
      //     const oldName = changedProperties.get('name');
      //     if (oldName) {
      //       this.dispatchEvent(
      //         // if name change solution
      //         /* new CustomEvent('change-form-element-name-register', {
      //           detail: { oldName, newName: this.name },
      //           bubbles: true,
      //           composed: true,
      //         }), */
      //         // elif remove solution
      //         new CustomEvent('remove-form-element-name-register', {
      //           detail: { oldName },
      //           bubbles: true,
      //           composed: true,
      //         }),
      //       );
      //       // if remove solution
      //       this.dispatchEvent(
      //         new CustomEvent('form-element-register', {
      //           detail: { element: this },
      //           bubbles: true,
      //           composed: true,
      //         }),
      //       );
      //     }
      //   }
      // }
    },
);
