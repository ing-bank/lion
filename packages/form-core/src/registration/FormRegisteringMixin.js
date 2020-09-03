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

      update(changedProperties) {
        super.update(changedProperties);
        if (changedProperties.has('name')) {
          const name = changedProperties.get('name');
          if (name) {
            this.dispatchEvent(
              new CustomEvent('remove-form-element-register', { detail: { name }, bubbles: true }),
            );
          }
        }
      }

      updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('name')) {
          this.dispatchEvent(
            new CustomEvent('form-element-register', {
              detail: { element: this },
              bubbles: true,
              composed: true,
            }),
          );
        }
      }
    },
);
