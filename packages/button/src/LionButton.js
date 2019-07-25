import { css, html, DelegateMixin, SlotMixin } from '@lion/core';
import { LionLitElement } from '@lion/core/src/LionLitElement.js';

export class LionButton extends DelegateMixin(SlotMixin(LionLitElement)) {
  static get properties() {
    return {
      disabled: {
        type: Boolean,
        reflect: true,
      },
      role: {
        type: String,
        reflect: true,
      },
      tabindex: {
        type: Number,
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
        <div class="click-area" @click="${this.__clickDelegationHandler}"></div>
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

        :host(:active) .btn,
        .btn[active] {
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

  _requestUpdate(name, oldValue) {
    super._requestUpdate(name, oldValue);
    if (name === 'disabled') {
      this.__onDisabledChanged(oldValue);
    }
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
    this.disabled = false;
    this.role = 'button';
    this.tabindex = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this.__setupDelegation();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.__teardownDelegation();
  }

  _redispatchClickEvent(oldEvent) {
    // replacing `MouseEvent` with `oldEvent.constructor` breaks IE
    const newEvent = new MouseEvent(oldEvent.type, oldEvent);
    this.__enforceHostEventTarget(newEvent);
    this.$$slot('_button').dispatchEvent(newEvent);
  }

  /**
   * Prevent click on the fake element and cause click on the native button.
   */
  __clickDelegationHandler(e) {
    e.stopPropagation();
    this._redispatchClickEvent(e);
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

  __setupDelegation() {
    this.addEventListener('keydown', this.__keydownDelegationHandler);
    this.addEventListener('keyup', this.__keyupDelegationHandler);
  }

  __teardownDelegation() {
    this.removeEventListener('keydown', this.__keydownDelegationHandler);
    this.removeEventListener('keyup', this.__keyupDelegationHandler);
  }

  __keydownDelegationHandler(e) {
    if (e.keyCode === 32 /* space */ || e.keyCode === 13 /* enter */) {
      e.preventDefault();
      this.shadowRoot.querySelector('.btn').setAttribute('active', '');
    }
  }

  __keyupDelegationHandler(e) {
    // Makes the real button the trigger in forms (will submit form, as opposed to paper-button)
    // and make click handlers on button work on space and enter
    if (e.keyCode === 32 /* space */ || e.keyCode === 13 /* enter */) {
      e.preventDefault();
      this.shadowRoot.querySelector('.btn').removeAttribute('active');
      this.shadowRoot.querySelector('.click-area').click();
    }
  }

  __onDisabledChanged() {
    if (this.disabled) {
      this.__originalTabIndex = this.tabindex;
      this.tabindex = -1;
    } else {
      this.tabindex = this.__originalTabIndex;
    }
  }
}
