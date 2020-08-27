import { html, css, LitElement, DisabledWithTabIndexMixin } from '@lion/core';

export class LionSwitchButton extends DisabledWithTabIndexMixin(LitElement) {
  static get properties() {
    return {
      role: {
        type: String,
        reflect: true,
      },
      checked: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
          position: relative;
          width: 36px;
          height: 16px;
          outline: 0;
        }

        :host([hidden]) {
          display: none;
        }

        .btn {
          position: relative;
          height: 100%;
          outline: 0;
        }

        :host(:focus:not([disabled])) .switch-button__thumb {
          /* if you extend, please overwrite */
          outline: 2px solid #bde4ff;
        }

        .switch-button__track {
          background: #eee;
          width: 100%;
          height: 100%;
        }

        .switch-button__thumb {
          background: #ccc;
          width: 50%;
          height: 100%;
          position: absolute;
          top: 0;
        }

        :host([checked]) .switch-button__thumb {
          right: 0;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="btn">
        <div class="switch-button__track"></div>
        <div class="switch-button__thumb"></div>
      </div>
    `;
  }

  constructor() {
    super();
    this.role = 'switch';
    this.checked = false;
    this.addEventListener('click', this.__handleToggleStateChange);
    this.addEventListener('keydown', this.__handleKeydown);
    this.addEventListener('keyup', this.__handleKeyup);
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('aria-checked', `${this.checked}`);
  }

  __handleToggleStateChange() {
    if (this.disabled) {
      return;
    }
    // Force IE11 to focus the component.
    this.focus();
    this.checked = !this.checked;
    this.dispatchEvent(
      new Event('checked-changed', {
        composed: true,
        bubbles: true,
      }),
    );
  }

  // eslint-disable-next-line class-methods-use-this
  __handleKeydown(e) {
    // prevent "space" scrolling on "macOS"
    if (e.keyCode === 32) {
      e.preventDefault();
    }
  }

  __handleKeyup(e) {
    if ([32 /* space */, 13 /* enter */].indexOf(e.keyCode) !== -1) {
      this.__handleToggleStateChange();
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('disabled')) {
      this.setAttribute('aria-disabled', `${this.disabled}`); // create mixin if we need it in more places
    }
  }

  /**
   * We synchronously update aria-checked to support voice over on safari.
   *
   * @override
   */
  requestUpdateInternal(name, oldValue) {
    super.requestUpdateInternal(name, oldValue);
    if (this.isConnected && name === 'checked') {
      this.setAttribute('aria-checked', `${this.checked}`);
    }
  }
}
