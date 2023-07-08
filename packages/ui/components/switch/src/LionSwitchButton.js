import { html, css, LitElement } from 'lit';
import { DisabledWithTabIndexMixin } from '@lion/ui/core.js';
import { hostMinimumClickArea } from '../../../shared-styles/host-minimum-click-area.js';

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
      hostMinimumClickArea,
      css`
        :host {
          position: relative;
          display: inline-block;
          width: 36px;
          height: 16px;
          outline: 0;
          background: #eee;
          cursor: pointer;
        }

        :host([hidden]) {
          display: none;
        }

        :host(:focus:not([disabled])) .switch-button__thumb {
          /* if you extend, please overwrite */
          outline: 2px solid #bde4ff;
        }

        .switch-button__thumb {
          display: block;
          width: 50%;
          height: 100%;
          background: #ccc;
        }

        :host([checked]) .switch-button__thumb {
          transform: translateX(100%);
        }
      `,
    ];
  }

  render() {
    return html` <span class="switch-button__thumb"><slot></slot></span> `;
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

  /** @param {import('lit').PropertyValues } changedProperties */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.__initialized = true;
  }
}
