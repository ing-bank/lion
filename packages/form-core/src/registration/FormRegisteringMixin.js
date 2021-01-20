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
      this._parentFormGroup = undefined;
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
      if (this._parentFormGroup) {
        this._parentFormGroup.removeFormElement(this);
      }
    }
  };

export const FormRegisteringMixin = dedupeMixin(FormRegisteringMixinImplementation);
