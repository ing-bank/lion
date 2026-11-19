import { LionButtonReset } from './LionButtonReset.js';

/**
 * @typedef {import('lit').TemplateResult} TemplateResult
 * @typedef {{lionButtons: Set<LionButtonSubmit>, helper:HTMLButtonElement, wrapper:HTMLDivElement, observer:MutationObserver}} HelperRegistration
 */

/** @type {WeakMap<HTMLFormElement, HelperRegistration>} */
const implicitHelperMap = new WeakMap();

function createImplicitSubmitHelperButton() {
  const buttonEl = document.createElement('button');
  buttonEl.tabIndex = -1;
  buttonEl.type = 'submit';
  buttonEl.setAttribute('aria-hidden', 'true');

  // Make it sr-only
  buttonEl.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    overflow: hidden;
    white-space: nowrap;
    height: 1px;
    width: 1px;
    padding: 0; /* reset default agent styles */
    border: 0; /* reset default agent styles */
  `;
  return buttonEl;
}

/**
 * Contains all the funcionaility of LionButton and LionButtonReset. On top of that it
 * supports implicit form submission.
 *
 * Use when:
 * - the Application Developer should be able to switch types between 'submit'|'reset'|'button'
 * (this is similar to how native HTMLButtonElement works)
 * - a submit button with native form support is needed
 *
 * @customElement lion-button-submit
 */
export class LionButtonSubmit extends LionButtonReset {
  /**
   * @type {HTMLButtonElement|null}
   * @protected
   */
  get _nativeButtonNode() {
    return implicitHelperMap.get(/** @type {HTMLFormElement} */ (this._form))?.helper || null;
  }

  constructor() {
    super();
    this.type = 'submit';

    /** @type {HTMLButtonElement|null} */
    this.__implicitSubmitHelperButton = null;
  }

  _setupSubmitAndResetHelperOnConnected() {
    super._setupSubmitAndResetHelperOnConnected();

    if (!this._form || this.type !== 'submit') {
      return;
    }
    /** @type {HTMLFormElement} */
    const form = this._form;
    const registrationForCurForm = implicitHelperMap.get(this._form);

    if (!registrationForCurForm) {
      const buttonEl = createImplicitSubmitHelperButton();
      const wrapperEl = document.createElement('div');
      wrapperEl.appendChild(buttonEl);
      // Prevent that the helper (or its wrapper) gets lost during a rerender of the form
      // or of the wrapper: restore whatever part was removed.
      const observer = new MutationObserver(() => {
        if (buttonEl.parentNode !== wrapperEl) {
          wrapperEl.appendChild(buttonEl);
        }
        if (wrapperEl.parentNode !== form) {
          form.appendChild(wrapperEl);
        }
      });
      implicitHelperMap.set(this._form, {
        lionButtons: new Set(),
        helper: buttonEl,
        wrapper: wrapperEl,
        observer,
      });
      form.appendChild(wrapperEl);
      observer.observe(wrapperEl, { childList: true });
      observer.observe(form, { childList: true });
    }
    implicitHelperMap.get(form)?.lionButtons.add(this);
  }

  _teardownSubmitAndResetHelperOnDisconnected() {
    super._teardownSubmitAndResetHelperOnDisconnected();

    if (this._form) {
      // If we are the last button to leave the form, clean up the
      const registrationForCurForm = /** @type {HelperRegistration} */ (
        implicitHelperMap.get(/** @type {HTMLFormElement} */ (this._form))
      );
      if (registrationForCurForm) {
        registrationForCurForm.lionButtons.delete(this);
        if (!registrationForCurForm.lionButtons.size) {
          // Disconnect first, so removing the wrapper is not undone by the observer
          registrationForCurForm.observer.disconnect();
          registrationForCurForm.wrapper.remove();
          implicitHelperMap.delete(this._form);
        }
      }
    }
  }
}
