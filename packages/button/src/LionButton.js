import { css, html, DelegateMixin, SlotMixin, DisabledWithTabIndexMixin } from '@lion/core';
import { LionLitElement } from '@lion/core/src/LionLitElement.js';

export class LionButton extends DisabledWithTabIndexMixin(
  DelegateMixin(SlotMixin(LionLitElement)),
) {
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
    };
  }

  render() {
    return html`
      <div class="btn">
        ${this._renderBefore()}
        <slot></slot>
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
          visibility: hidden;
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
    ];
  }

  get delegations() {
    return {
      ...super.delegations,
      target: () => this.$$slot('_button'),
      attributes: ['type'],
    };
  }

  get slots() {
    return {
      ...super.slots,
      _button: () => {
        if (!this.constructor._button) {
          this.constructor._button = document.createElement('button');
          this.constructor._button.setAttribute('slot', '_button');
          this.constructor._button.setAttribute('tabindex', '-1');
        }
        return this.constructor._button.cloneNode();
      },
    };
  }

  constructor() {
    super();
    this.role = 'button';
    this.active = false;
    this.__setupDelegationInConstructor();
  }

  connectedCallback() {
    super.connectedCallback();
    this.__setupEvents();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.__teardownEvents();
  }

  _redispatchClickEvent(oldEvent) {
    // replacing `MouseEvent` with `oldEvent.constructor` breaks IE
    const newEvent = new MouseEvent(oldEvent.type, oldEvent);
    newEvent.__isRedispatchedOnNativeButton = true;
    this.__enforceHostEventTarget(newEvent);
    this.$$slot('_button').dispatchEvent(newEvent);
  }

  /**
   * Prevent normal click and redispatch click on the native button unless already redispatched.
   */
  __clickDelegationHandler(e) {
    if (!e.__isRedispatchedOnNativeButton) {
      e.stopImmediatePropagation();
      this._redispatchClickEvent(e);
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
}
