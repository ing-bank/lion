import { LionButton } from './LionButton.js';

/**
 * @typedef {import('@lion/core').TemplateResult} TemplateResult
 */

/**
 * This adds functionality for form buttons (type 'submit' and 'reset').
 * It allows to submit or reset a <form> by spawning a click on a temporrary native button inside
 * the form.
 * Use LionButtonSubmit when implicit form submission should be supported as well.
 *
 * Functionality in this button is not purely for type="reset", also for type="submit".
 * For mainainability purposes the submit functionality is part of LionButtonReset
 * (it needs the same logic).
 * LionButtonReset could therefore actually be considered as 'LionButtonForm' (without the
 * implicit form submission logic), but LionButtonReset is an easier to grasp name for
 * Application Developers: for reset buttons, always use LionButtonReset, for submit
 * buttons always use LionButtonSubmit.
 */
export class LionButtonReset extends LionButton {
  constructor() {
    super();
    this.type = 'reset';
    this.__setupDelegationInConstructor();

    /** @type {HTMLButtonElement} */
    this.__submitAndResetHelperButton = document.createElement('button');

    /** @type {EventListener} */
    this.__preventEventLeakage = this.__preventEventLeakage.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    // Old browsers (IE11, Old Edge, Firefox ESR 60) don't have the `.form`
    // property defined immediately on the native button, so do this after first render on connected.
    this.updateComplete.then(() => {
      this._setupSubmitAndResetHelperOnConnected();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._teardownSubmitAndResetHelperOnDisconnected();
  }

  /**
   * Prevents that someone who listens outside or on form catches the click event
   * @param {Event} e
   * @private
   */
  __preventEventLeakage(e) {
    if (e.target === this.__submitAndResetHelperButton) {
      e.stopImmediatePropagation();
    }
  }

  /**
   * @protected
   */
  _setupSubmitAndResetHelperOnConnected() {
    // Get form
    this.appendChild(this.__submitAndResetHelperButton);
    /** @type {HTMLFormElement|null} */
    this._form = this.__submitAndResetHelperButton.form;
    this.removeChild(this.__submitAndResetHelperButton);

    if (this._form) {
      this._form.addEventListener('click', this.__preventEventLeakage);
    }
  }

  /**
   * @protected
   */
  _teardownSubmitAndResetHelperOnDisconnected() {
    if (this._form) {
      this._form.removeEventListener('click', this.__preventEventLeakage);
    }
  }

  /**
   * Delegate click, by flashing a native button as a direct child
   * of the form, and firing click on this button. This will fire the form submit
   * without side effects caused by the click bubbling back up to lion-button.
   * @param {Event} ev
   * @protected
   * @returns {Promise<void>}
   */
  // TODO: rename to _clickDelegationHandler in v1
  async __clickDelegationHandler(ev) {
    // Wait for updateComplete if form is not yet available
    if (!this._form) {
      await this.updateComplete;
    }

    if ((this.type === 'submit' || this.type === 'reset') && ev.target === this && this._form) {
      /**
       * Here, we make sure our button is compatible with a native form, by firing a click
       * from a native button that our form responds to. The native button we spawn will be a direct
       * child of the form, plus the click event that will be sent will be prevented from
       * propagating outside of the form. This will keep the amount of 'noise' (click events
       * from 'ghost elements' that can be intercepted by listeners in the bubble chain) to an
       * absolute minimum.
       */
      this.__submitAndResetHelperButton.type = this.type;

      this._form.appendChild(this.__submitAndResetHelperButton);
      // Form submission or reset will happen
      this.__submitAndResetHelperButton.click();
      this._form.removeChild(this.__submitAndResetHelperButton);
    }
  }

  /**
   * @private
   */
  __setupDelegationInConstructor() {
    // do not move to connectedCallback, otherwise IE11 breaks.
    // more info: https://github.com/ing-bank/lion/issues/179#issuecomment-511763835
    this.addEventListener('click', this.__clickDelegationHandler, true);
  }
}
