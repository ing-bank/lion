import { html, css, LitElement, DisabledWithTabIndexMixin } from '@lion/core';

export class LionSwitchButton extends DisabledWithTabIndexMixin(LitElement) {
  static get properties() {
    return {
      ...super.properties,
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
    // inputNode = this, which always requires a value prop
    this.value = '';

    this.role = 'switch';
    this.checked = false;
    this.__toggleChecked = this.__toggleChecked.bind(this);
    this.__handleKeydown = this.__handleKeydown.bind(this);
    this.__handleKeyup = this.__handleKeyup.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('aria-checked', `${this.checked}`);
    this.addEventListener('click', this.__toggleChecked);
    this.addEventListener('keydown', this.__handleKeydown);
    this.addEventListener('keyup', this.__handleKeyup);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.__toggleChecked);
    this.removeEventListener('keydown', this.__handleKeydown);
    this.removeEventListener('keyup', this.__handleKeyup);
  }

  __toggleChecked() {
    if (this.disabled) {
      return;
    }
    // Force IE11 to focus the component.
    this.focus();
    this.checked = !this.checked;
  }

  __checkedStateChange() {
    this.dispatchEvent(
      new Event('checked-changed', {
        composed: true,
        bubbles: true,
      }),
    );
    this.setAttribute('aria-checked', `${this.checked}`);
  }

  /**
   * @param {KeyboardEvent} e
   */
  // eslint-disable-next-line class-methods-use-this
  __handleKeydown(e) {
    // prevent "space" scrolling on "macOS"
    if (e.keyCode === 32) {
      e.preventDefault();
    }
  }

  /**
   * @param {KeyboardEvent} e
   */
  __handleKeyup(e) {
    if ([32 /* space */, 13 /* enter */].indexOf(e.keyCode) !== -1) {
      this.__toggleChecked();
    }
  }

  /** @param {import('lit-element').PropertyValues } changedProperties */
  updated(changedProperties) {
    if (changedProperties.has('disabled')) {
      this.setAttribute('aria-disabled', `${this.disabled}`); // create mixin if we need it in more places
    }
  }

  /**
   * We synchronously update aria-checked to support voice over on safari.
   *
   * @param {PropertyKey} name
   * @param {?} oldValue
   * @override
   */
  requestUpdateInternal(name, oldValue) {
    super.requestUpdateInternal(name, oldValue);
    if (this.isConnected && name === 'checked' && this.checked !== oldValue) {
      this.__checkedStateChange();
    }
  }
}
