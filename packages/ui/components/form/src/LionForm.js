import { LionFieldset } from '@lion/ui/fieldset.js';

/**
 * @typedef {import('../../form-core/types/registration/FormRegistrarMixinTypes.js').FormRegistrarHost} FormRegistrarHost
 */

const throwFormNodeError = () => {
  throw new Error(
    'No form node found. Did you put a <form> element inside your custom-form element?',
  );
};

/**
 * LionForm: form wrapper providing extra features and integration with lion-field elements.
 *
 * @customElement lion-form
 */
export class LionForm extends LionFieldset {
  constructor() {
    super();
    /** @protected */
    this._submit = this._submit.bind(this);
    /** @protected */
    this._reset = this._reset.bind(this);
    /**
     * The form node the listeners were added to, so they can be removed from the same node
     * @type {HTMLFormElement|undefined}
     * @private
     */
    this.__registeredFormNode = undefined;
  }

  connectedCallback() {
    super.connectedCallback();
    this.__registerEventsForLionForm();

    // @override LionFieldset: makes sure a11y is handled by ._formNode
    this.removeAttribute('role');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.__teardownEventsForLionForm();
  }

  get _formNode() {
    return /** @type {HTMLFormElement} */ (this.querySelector('form'));
  }

  submit() {
    if (this._formNode) {
      // Firefox requires cancelable flag, otherwise we cannot preventDefault
      // Firefox still runs default handlers for untrusted events :\
      this._formNode.dispatchEvent(new Event('submit', { cancelable: true }));
    } else {
      throwFormNodeError();
    }
  }

  /**
   * @param {Event} ev
   * @protected
   */
  _submit(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    this.submitGroup();
    this.dispatchEvent(new Event('submit', { bubbles: true }));

    if (this.hasFeedbackFor?.includes('error')) {
      this._setFocusOnFirstErroneousFormElement(/** @type { * & FormRegistrarHost } */ (this));
    }
  }

  reset() {
    if (this._formNode) {
      this._formNode.reset();
    } else {
      throwFormNodeError();
    }
  }

  /**
   * @param {Event} ev
   * @protected
   */
  _reset(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    this.resetGroup();
    this.dispatchEvent(new Event('reset', { bubbles: true }));
  }

  /**
   * @param {FormRegistrarHost} element
   * @protected
   */
  _setFocusOnFirstErroneousFormElement(element) {
    const firstFormElWithError =
      element.formElements.find(child => child.hasFeedbackFor.includes('error')) ||
      element.formElements[0];

    if (firstFormElWithError._focusableNode) {
      firstFormElWithError._focusableNode.focus();
    } else {
      this._setFocusOnFirstErroneousFormElement(firstFormElWithError);
    }
  }

  /** @private */
  __registerEventsForLionForm() {
    // Without an inner <form> there is nothing to listen to; submit() and reset() report this
    const formNode = this._formNode;
    if (!formNode) return;
    this.__registeredFormNode = formNode;
    formNode.addEventListener('submit', this._submit);
    formNode.addEventListener('reset', this._reset);
  }

  /** @private */
  __teardownEventsForLionForm() {
    const formNode = this.__registeredFormNode;
    if (!formNode) return;
    this.__registeredFormNode = undefined;
    formNode.removeEventListener('submit', this._submit);
    formNode.removeEventListener('reset', this._reset);
  }
}
