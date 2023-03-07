import { LionButtonReset } from './LionButtonReset.js';

/**
 * @typedef {{lionButtons: Set<LionButtonSubmit>, helper:HTMLButtonElement, observer:MutationObserver}} HelperRegistration
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
      implicitHelperMap.set(this._form, {
        lionButtons: new Set(),
        helper: buttonEl,
        observer: new MutationObserver(() => {
          form.appendChild(wrapperEl);
        }),
      });
      form.appendChild(wrapperEl);

      // Prevent that the just created button gets lost during rerender
      implicitHelperMap.get(form)?.observer.observe(wrapperEl, { childList: true });
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
          if (this._form.contains(registrationForCurForm.helper)) {
            registrationForCurForm.helper.remove();
          }
          implicitHelperMap.get(this._form)?.observer.disconnect();
          implicitHelperMap.delete(this._form);
        }
      }
    }
  }
}
