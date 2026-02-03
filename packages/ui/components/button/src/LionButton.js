import { html, LitElement } from 'lit';
import { DisabledWithTabIndexMixin } from '@lion/ui/core.js';
import { buttonStyle } from './buttonStyle.js';

const isKeyboardClickEvent = (/** @type {KeyboardEvent} */ e) => e.key === ' ' || e.key === 'Enter';
const isSpaceKeyboardClickEvent = (/** @type {KeyboardEvent} */ e) => e.key === ' ';

// TODO: simplify html structure, as we got rid of the wrapper element for IE11

/**
 * @typedef {import('lit').TemplateResult} TemplateResult
 */

/**
 * Use LionButton (or LionButtonReset|LionButtonSubmit) when there is a need to extend HTMLButtonElement.
 * It allows to create complex shadow DOM for buttons needing this. Think of:
 * - a material Design button that needs a JS controlled ripple
 * - a LionSelectRich invoker that needs a complex shadow DOM structure
 * (for styling/maintainability purposes)
 * - a specialized button (for instance a primary button or icon button in a Design System) that
 * needs a simple api: `<my-button>text</my-button>` is always better than
 * `<button class="my-button"><div class="my-button__container">text</div><button>`
 *
 * In other cases, whenever you can, still use native HTMLButtonElement (`<button>`).
 *
 * Note that LionButton is meant for buttons with type="button". It's cleaner and more
 * lightweight than LionButtonReset and LionButtonSubmit, which should only be considered when native
 * `<form>` support is needed:
 * - When type="reset|submit" should be supported, use LionButtonReset.
 * - When implicit form submission should be supported on top, use LionButtonSubmit.
 *
 * @customElement lion-button
 */
export class LionButton extends DisabledWithTabIndexMixin(LitElement) {
  static properties = {
    active: { type: Boolean, reflect: true },
    type: { type: String, reflect: true },
  };

  static styles = [buttonStyle];

  constructor() {
    super();
    this.type = 'button';
    this.active = false;
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button');
    }
    this.#setupEvents();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#cleanupEvents();
  }

  /**
   * @param {import('lit').PropertyValues } changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('disabled')) {
      if (this.disabled) {
        this.setAttribute('aria-disabled', 'true');
      } else if (this.getAttribute('aria-disabled') !== null) {
        this.removeAttribute('aria-disabled');
      }
    }
  }

  #setupEvents = () => {
    this.addEventListener('mousedown', this.#mousedownHandler);
    this.addEventListener('keydown', this.#keydownHandler);
    this.addEventListener('keyup', this.#keyupHandler);
  };

  #cleanupEvents = () => {
    this.removeEventListener('mousedown', this.#mousedownHandler);
    this.removeEventListener('keydown', this.#keydownHandler);
    this.removeEventListener('keyup', this.#keyupHandler);
  };

  #mousedownHandler = () => {
    this.active = true;
    const mouseupHandler = () => {
      this.active = false;
      document.removeEventListener('mouseup', mouseupHandler);
      this.removeEventListener('mouseup', mouseupHandler);
    };
    document.addEventListener('mouseup', mouseupHandler);
    this.addEventListener('mouseup', mouseupHandler);
  };

  /**
   * @param {KeyboardEvent} event
   */
  #keydownHandler = event => {
    if (this.active || !isKeyboardClickEvent(event)) {
      if (isSpaceKeyboardClickEvent(event)) {
        event.preventDefault();
      }
      return;
    }

    if (isSpaceKeyboardClickEvent(event)) {
      event.preventDefault();
    }

    this.active = true;
    /**
     * @param {KeyboardEvent} keyupEvent
     */
    const keyupHandler = keyupEvent => {
      if (isKeyboardClickEvent(keyupEvent)) {
        this.active = false;
        document.removeEventListener('keyup', keyupHandler, true);
      }
    };
    document.addEventListener('keyup', keyupHandler, true);
  };

  /**
   * @param {KeyboardEvent} event
   */
  #keyupHandler = event => {
    if (!isKeyboardClickEvent(event)) {
      return;
    }
    // Fixes IE11 double submit/click. Enter keypress somehow triggers the #keyUpHandler on the native <button>
    if (event.target && event.target !== this) {
      return;
    }
    // dispatch click
    this.click();
  };

  render() {
    return html` <div class="button-content"><slot></slot></div> `;
  }
}
