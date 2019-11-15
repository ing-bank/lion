import { css, html, SlotMixin, DisabledWithTabIndexMixin, LitElement } from '@lion/core';

// eslint-disable-next-line class-methods-use-this
const isKeyboardClickEvent = e => e.keyCode === 32 /* space */ || e.keyCode === 13; /* enter */

export class LionButton extends DisabledWithTabIndexMixin(SlotMixin(LitElement)) {
  static get properties() {
    return {
      role: {
        type: String,
        reflect: true,
      },
      active: {
        type: Boolean,
        reflect: true,
      },
      type: {
        type: String,
        reflect: true,
      },
    };
  }

  render() {
    return html`
      <div class="btn">
        ${this._renderBefore()}
        ${this.constructor.__isIE11()
          ? html`
              <div id="${this._buttonId}"><slot></slot></div>
            `
          : html`
              <slot></slot>
            `}
        ${this._renderAfter()}
        <slot name="_button"></slot>
        <div class="click-area"></div>
      </div>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  _renderBefore() {
    return html``;
  }

  // eslint-disable-next-line class-methods-use-this
  _renderAfter() {
    return html``;
  }

  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
          padding-top: 2px;
          padding-bottom: 2px;
          min-height: 40px; /* src = https://www.smashingmagazine.com/2012/02/finger-friendly-design-ideal-mobile-touchscreen-target-sizes/ */
          outline: 0;
          background-color: transparent;
          box-sizing: border-box;
        }

        .btn {
          min-height: 24px;
          display: flex;
          align-items: center;
          position: relative;
          background: #eee; /* minimal styling to make it recognizable as btn */
          padding: 7px 15px;
          outline: none; /* focus style handled below, else it follows boundaries of click-area */
        }

        :host .btn ::slotted(button) {
          position: absolute;
          clip: rect(0 0 0 0);
          clip-path: inset(50%);
          overflow: hidden;
          white-space: nowrap;
          height: 1px;
          width: 1px;
        }

        .click-area {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          margin: -3px -1px;
          padding: 0;
        }

        :host(:focus:not([disabled])) .btn {
          /* if you extend, please overwrite */
          outline: 2px solid #bde4ff;
        }

        :host(:hover) .btn {
          /* if you extend, please overwrite */
          background: #f4f6f7;
        }

        :host(:active) .btn, /* keep native :active to render quickly where possible */
        :host([active]) .btn /* use custom [active] to fix IE11 */ {
          /* if you extend, please overwrite */
          background: gray;
        }

        :host([disabled]) {
          pointer-events: none;
        }

        :host([disabled]) .btn {
          /* if you extend, please overwrite */
          background: lightgray;
          color: #adadad;
          fill: #adadad;
        }
      `,
    ];
  }

  get _nativeButtonNode() {
    return Array.from(this.children).find(child => child.slot === '_button');
  }

  get _form() {
    return this._nativeButtonNode.form;
  }

  get slots() {
    return {
      ...super.slots,
      _button: () => {
        if (!this.constructor._button) {
          this.constructor._button = document.createElement('button');
          this.constructor._button.setAttribute('tabindex', '-1');
          this.constructor._button.setAttribute('aria-hidden', true);
        }
        return this.constructor._button.cloneNode();
      },
    };
  }

  constructor() {
    super();
    this.role = 'button';
    this.type = 'submit';
    this.active = false;
    this.__setupDelegationInConstructor();

    if (this.constructor.__isIE11()) {
      this._buttonId = `button-${Math.random()
        .toString(36)
        .substr(2, 10)}`;
      this.setAttribute('aria-labelledby', this._buttonId);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.__setupEvents();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.__teardownEvents();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('type')) {
      const native = this._nativeButtonNode;
      if (native) {
        native.type = this.type;
      }
    }
  }

  /**
   * Delegate click, by flashing a native button as a direct child
   * of the form, and firing click on this button. This will fire the form submit
   * without side effects caused by the click bubbling back up to lion-button.
   */
  __clickDelegationHandler(e) {
    if (this.constructor.__isIE11()) {
      e.stopPropagation();
    }

    if ((this.type === 'submit' || this.type === 'reset') && e.target === this) {
      if (this._form) {
        const nativeButton = document.createElement('button');
        nativeButton.type = this.type;
        this._form.appendChild(nativeButton);
        nativeButton.click();
        this._form.removeChild(nativeButton);
      }
    }
  }

  __setupDelegationInConstructor() {
    // do not move to connectedCallback, otherwise IE11 breaks
    // more info: https://github.com/ing-bank/lion/issues/179#issuecomment-511763835
    this.addEventListener('click', this.__clickDelegationHandler, true);
  }

  __setupEvents() {
    this.addEventListener('mousedown', this.__mousedownHandler);
    this.addEventListener('keydown', this.__keydownHandler);
    this.addEventListener('keyup', this.__keyupHandler);
  }

  __teardownEvents() {
    this.removeEventListener('mousedown', this.__mousedownHandler);
    this.removeEventListener('keydown', this.__keydownHandler);
    this.removeEventListener('keyup', this.__keyupHandler);
  }

  __mousedownHandler() {
    this.active = true;
    const mouseupHandler = () => {
      this.active = false;
      document.removeEventListener('mouseup', mouseupHandler);
    };
    document.addEventListener('mouseup', mouseupHandler);
  }

  __keydownHandler(e) {
    if (this.active || !isKeyboardClickEvent(e)) {
      return;
    }
    // FIXME: In Edge & IE11, this toggling the active state to prevent bounce, does not work.
    this.active = true;
    const keyupHandler = keyupEvent => {
      if (isKeyboardClickEvent(keyupEvent)) {
        this.active = false;
        document.removeEventListener('keyup', keyupHandler, true);
      }
    };
    document.addEventListener('keyup', keyupHandler, true);
  }

  __keyupHandler(e) {
    if (isKeyboardClickEvent(e)) {
      // Fixes IE11 double submit/click. Enter keypress somehow triggers the __keyUpHandler on the native <button>
      if (e.srcElement && e.srcElement !== this) {
        return;
      }
      // dispatch click
      this.click();
    }
  }

  static __isIE11() {
    const ua = window.navigator.userAgent;
    const result = /Trident/.test(ua);
    return result;
  }
}
