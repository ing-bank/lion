import { browserDetection, css, DisabledWithTabIndexMixin, html, LitElement } from '@lion/core';
import '@lion/core/differentKeyEventNamesShimIE';

const isKeyboardClickEvent = (/** @type {KeyboardEvent} */ e) => e.key === ' ' || e.key === 'Enter';
const isSpaceKeyboardClickEvent = (/** @type {KeyboardEvent} */ e) => e.key === ' ';

/**
 * @typedef {import('@lion/core').TemplateResult} TemplateResult
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
 */
export class LionButton extends DisabledWithTabIndexMixin(LitElement) {
  static get properties() {
    return {
      active: { type: Boolean, reflect: true },
      type: { type: String, reflect: true },
    };
  }

  render() {
    return html` <div class="button-content" id="${this._buttonId}"><slot></slot></div> `;
  }

  static get styles() {
    return [
      css`
        :host {
          position: relative;
          display: inline-flex;
          box-sizing: border-box;
          vertical-align: middle;
          line-height: 24px;
          background: #eee; /* minimal styling to make it recognizable as btn */
          padding: 8px; /* padding to fix with min-height */
          outline: none; /* focus style handled below */
          cursor: default; /* we should always see the default arrow, never a caret */
          /* TODO: remove, native button also allows selection. Could be usability concern... */
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        :host::before {
          content: '';

          /* center vertically and horizontally */
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);

          /* touch area (comes into play when button height goes below this one) */
          /* src = https://www.smashingmagazine.com/2012/02/finger-friendly-design-ideal-mobile-touchscreen-target-sizes/ */
          min-height: 40px;
          min-width: 40px;
          width: 100%;
          height: 100%;
        }

        .button-content {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Show focus styles on keyboard focus. */
        :host(:focus:not([disabled])),
        :host(:focus-visible) {
          /* if you extend, please overwrite */
          outline: 2px solid #bde4ff;
        }

        /* Hide focus styles if they're not needed, for example,
        when an element receives focus via the mouse. */
        :host(:focus:not(:focus-visible)) {
          outline: 0;
        }

        :host(:hover) {
          /* if you extend, please overwrite */
          background: #f4f6f7;
        }

        :host(:active), /* keep native :active to render quickly where possible */
        :host([active]) /* use custom [active] to fix IE11 */ {
          /* if you extend, please overwrite */
          background: gray;
        }

        :host([hidden]) {
          display: none;
        }

        :host([disabled]) {
          pointer-events: none;
          /* if you extend, please overwrite */
          background: lightgray;
          color: #adadad;
          fill: #adadad;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.type = 'button';
    this.active = false;

    this._buttonId = `button-${Math.random().toString(36).substr(2, 10)}`;
    if (browserDetection.isIE11) {
      this.updateComplete.then(() => {
        if (!this.hasAttribute('aria-labelledby')) {
          this.setAttribute('aria-labelledby', this._buttonId);
        }
      });
    }
    this.__setupEvents();
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button');
    }
  }

  /**
   * @param {import('@lion/core').PropertyValues } changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('disabled')) {
      this.setAttribute('aria-disabled', `${this.disabled}`); // create mixin if we need it in more places
    }
  }

  /**
   * @private
   */
  __setupEvents() {
    this.addEventListener('mousedown', this.__mousedownHandler);
    this.addEventListener('keydown', this.__keydownHandler);
    this.addEventListener('keyup', this.__keyupHandler);
  }

  /**
   * @private
   */
  __mousedownHandler() {
    this.active = true;
    const mouseupHandler = () => {
      this.active = false;
      document.removeEventListener('mouseup', mouseupHandler);
      this.removeEventListener('mouseup', mouseupHandler);
    };
    document.addEventListener('mouseup', mouseupHandler);
    this.addEventListener('mouseup', mouseupHandler);
  }

  /**
   * @param {KeyboardEvent} event
   * @private
   */
  __keydownHandler(event) {
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
  }

  /**
   * @param {KeyboardEvent} event
   * @private
   */
  __keyupHandler(event) {
    if (isKeyboardClickEvent(event)) {
      // Fixes IE11 double submit/click. Enter keypress somehow triggers the __keyUpHandler on the native <button>
      if (event.target && event.target !== this) {
        return;
      }
      // dispatch click
      this.click();
    }
  }
}
