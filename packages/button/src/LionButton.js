import { css, html, SlotMixin, DisabledWithTabIndexMixin, LitElement } from '@lion/core';

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

        :host(:focus) .btn {
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
      ...(this.__isIE11() /* visibility hidden in IE11 breaks native button functionality */
        ? [
            /* TODO: Make SR-only css mixin? */
            css`
              :host .btn ::slotted(button) {
                clip: rect(0, 0, 0, 0);
              }
            `,
          ]
        : [
            css`
              :host .btn ::slotted(button) {
                visibility: hidden;
              }
            `,
          ]),
    ];
  }

  get slots() {
    return {
      ...super.slots,
      _button: () => {
        if (!this.constructor._button) {
          this.constructor._button = document.createElement('button');
          this.constructor._button.setAttribute('tabindex', '-1');
        }
        return this.constructor._button.cloneNode();
      },
    };
  }

  get _nativeButtonNode() {
    return this.querySelector('[slot=_button]');
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

  _redispatchClickEvent(oldEvent) {
    // replacing `MouseEvent` with `oldEvent.constructor` breaks IE
    const newEvent = new MouseEvent(oldEvent.type, oldEvent);
    newEvent.__isRedispatchedOnNativeButton = true;
    this.__enforceHostEventTarget(newEvent);
    this._nativeButtonNode.dispatchEvent(newEvent);
  }

  /**
   * Prevent normal click and redispatch submit on the native button unless already redispatched.
   */
  __clickDelegationHandler() {
    if (this.type === 'submit' && this._nativeButtonNode.form) {
      this._nativeButtonNode.form.submit();
    }
  }

  __enforceHostEventTarget(event) {
    try {
      // this is for IE11 (and works in others), because `Object.defineProperty` does not give any effect there
      event.__defineGetter__('target', () => this); // eslint-disable-line no-restricted-properties
    } catch (error) {
      // in case `__defineGetter__` is removed from the platform
      Object.defineProperty(event, 'target', { writable: false, value: this });
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
    if (this.active || !this.__isKeyboardClickEvent(e)) {
      return;
    }
    this.active = true;
    const keyupHandler = keyupEvent => {
      if (this.__isKeyboardClickEvent(keyupEvent)) {
        this.active = false;
        document.removeEventListener('keyup', keyupHandler, true);
      }
    };
    document.addEventListener('keyup', keyupHandler, true);
  }

  __keyupHandler(e) {
    if (this.__isKeyboardClickEvent(e)) {
      // redispatch click
      this.shadowRoot.querySelector('.click-area').click();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  __isKeyboardClickEvent(e) {
    return e.keyCode === 32 /* space */ || e.keyCode === 13 /* enter */;
  }

  static __isIE11() {
    const ua = window.navigator.userAgent;
    const result = /Trident/.test(ua);
    return result;
  }
}
