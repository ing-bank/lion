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
       * In case the form component should not register itself, set this property to true
       */
      this.preventRegistration = false;
      /**
       * The registrar this FormControl registers to, Usually a descendant of FormGroup or
       * ChoiceGroup
       * @type {FormRegistrarHost | undefined}
       */
      this._parentFormGroup = undefined;
      /**
       * To encourage accessibility best practices, `form-element-register` events
       * do not pierce through shadow roots. This forces the developer to create form groups and fieldsets that automatically allow the creation of accessible relationships in the same dom tree.
      Use this option if you know what you're doing. It will then be possible to nest FormControls
      inside shadow dom. See https://lion-web.netlify.app/fundamentals/rationales/accessibility/#shadow-roots-and-accessibility
      */
      this.allowCrossRootRegistration = false;
    }

    static get properties() {
      return {
        allowCrossRootRegistration: { type: Boolean, attribute: 'allow-cross-root-registration' },
      };
    }

    connectedCallback() {
      super.connectedCallback();
      if (!this.preventRegistration) {
        this.dispatchEvent(
          new CustomEvent('form-element-register', {
            detail: { element: this },
            bubbles: true,
            composed: Boolean(this.allowCrossRootRegistration),
          }),
        );
      }
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
