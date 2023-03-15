import { html, css, LitElement } from 'lit';
import { DisabledWithTabIndexMixin } from '@lion/ui/core.js';

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
    // inputNode = this, which always requires a value prop
    this.value = '';

    this.role = 'switch';
    this.checked = false;
    this.__initialized = false;
    /** @protected */
    this._toggleChecked = this._toggleChecked.bind(this);
    /** @private */
    this.__handleKeydown = this._handleKeydown.bind(this);
    /** @private */
    this.__handleKeyup = this._handleKeyup.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('aria-checked', `${this.checked}`);
    this.addEventListener('click', this._toggleChecked);
    this.addEventListener('keydown', this.__handleKeydown);
    this.addEventListener('keyup', this.__handleKeyup);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this._toggleChecked);
    this.removeEventListener('keydown', this.__handleKeydown);
    this.removeEventListener('keyup', this.__handleKeyup);
  }

  /** @protected */
  _toggleChecked() {
    if (this.disabled) {
      return;
    }
    // Force IE11 to focus the component.
    this.focus();
    this.checked = !this.checked;
  }

  /** @private */
  __checkedStateChange() {
    this.dispatchEvent(
      new Event('checked-changed', {
        bubbles: true,
      }),
    );
    this.setAttribute('aria-checked', `${this.checked}`);
  }

  /**
   * @param {KeyboardEvent} ev
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _handleKeydown(ev) {
    // prevent "space" scrolling on "macOS"
    if (ev.key === ' ') {
      ev.preventDefault();
    }
  }

  /**
   * @param {KeyboardEvent} ev
   * @protected
   */
  _handleKeyup(ev) {
    if ([' ', 'Enter'].includes(ev.key)) {
      this._toggleChecked();
    }
  }

  /** @param {import('lit').PropertyValues } changedProperties */
  updated(changedProperties) {
    if (changedProperties.has('disabled')) {
      this.setAttribute('aria-disabled', `${this.disabled}`); // create mixin if we need it in more places
    }
  }

  /**
   * @param {string} [name]
   * @param {unknown} [oldValue]
   * @param {import('lit').PropertyDeclaration} [options]
   * @returns {void}
   */
  requestUpdate(name, oldValue, options) {
    super.requestUpdate(name, oldValue, options);
    if (
      this.__initialized &&
      this.isConnected &&
      name === 'checked' &&
      this.checked !== oldValue &&
      !this.disabled
    ) {
      this.__checkedStateChange();
    }
  }

  firstUpdated() {
    this.__initialized = true;
  }
}
