import { dedupeMixin } from '@open-wc/dedupe-mixin';

/**
 * @typedef {import('lit').LitElement} LitElement
 * @typedef {import('../../types/FormControlMixinTypes.js').FormControlHost} FormControlHost
 * @typedef {import('../../types/registration/FormRegisteringMixinTypes.js').FormRegisteringMixin} FormRegisteringMixin
 * @typedef {import('../../types/registration/FormRegisteringMixinTypes.js').FormRegisteringHost} FormRegisteringHost
 * @typedef {import('../../types/registration/FormRegistrarMixinTypes.js').ElementWithParentFormGroup} ElementWithParentFormGroup
 * @typedef {import('../../types/registration/FormRegistrarMixinTypes.js').FormRegistrarHost} FormRegistrarHost
 */

/**
 * #FormRegisteringMixin:
 *
 * This Mixin registers a form element to a Registrar
 *
 * @type {FormRegisteringMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<LitElement>} superclass
 */
const FormRegisteringMixinImplementation = superclass =>
  // @ts-ignore https://github.com/microsoft/TypeScript/issues/36821#issuecomment-588375051
  class extends superclass {
    constructor() {
      super();
      /**
       * The registrar this FormControl registers to, Usually a descendant of FormGroup or
       * ChoiceGroup
       * @type {FormRegistrarHost | undefined}
       */
      this._parentFormGroup = undefined;
    }

    connectedCallback() {
      super.connectedCallback();
      this.dispatchEvent(
        new CustomEvent('form-element-register', {
          detail: { element: this },
          bubbles: true,
        }),
      );
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this.__unregisterFormElement();
    }

    /**
     * Putting this in a separate method makes testing easier
     * @private
     */
    __unregisterFormElement() {
      if (this._parentFormGroup) {
        this._parentFormGroup.removeFormElement(/** @type {* & FormRegisteringHost} */ (this));
      }
    }
  };

export const FormRegisteringMixin = dedupeMixin(FormRegisteringMixinImplementation);
