import { dedupeMixin } from '@lion/core';

/**
 * @typedef {import('../../types/registration/FormRegisteringMixinTypes').FormRegisteringMixin} FormRegisteringMixin
 * @typedef {import('../../types/registration/FormRegistrarMixinTypes').ElementWithParentFormGroup} ElementWithParentFormGroup
 * @typedef {import('../../types/registration/FormRegistrarMixinTypes').FormRegistrarHost} FormRegistrarHost
 */

/**
 * #FormRegisteringMixin:
 *
 * This Mixin registers a form element to a Registrar
 *
 * @type {FormRegisteringMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<HTMLElement>} superclass
 */
const FormRegisteringMixinImplementation = superclass =>
  class extends superclass {
    constructor() {
      super();
      /** @type {FormRegistrarHost | undefined} */
      this.__parentFormGroup = undefined;
    }

    connectedCallback() {
      // @ts-expect-error check it anyway, because could be lit-element extension
      if (super.connectedCallback) {
        // @ts-expect-error check it anyway, because could be lit-element extension
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
      // @ts-expect-error check it anyway, because could be lit-element extension
      if (super.disconnectedCallback) {
        // @ts-expect-error check it anyway, because could be lit-element extension
        super.disconnectedCallback();
      }
      if (this.__parentFormGroup) {
        this.__parentFormGroup.removeFormElement(this);
      }
    }

    update(/** @type {Object} */ changedProperties) {
      // @ts-ignore
      super.update(changedProperties);
      // @ts-ignore
      if (changedProperties.has('name')) {
        // @ts-ignore
        const oldName = changedProperties.get('name');
        if (oldName) {
          this.dispatchEvent(
            // if name change solution
            new CustomEvent('change-form-element-name-register', {
              // @ts-ignore
              detail: { oldName, newName: this.name },
              bubbles: true,
              composed: true,
            }),
          );
        }
      }
    }
  };

export const FormRegisteringMixin = dedupeMixin(FormRegisteringMixinImplementation);
