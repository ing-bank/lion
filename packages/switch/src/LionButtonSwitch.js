import { LionButton } from '@lion/button';
import { html, css } from '@lion/core';

export class LionButtonSwitch extends LionButton {
  static get properties() {
    return {
      checked: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: inline-block;
          position: relative;
          width: 36px;
          height: 16px;
          /* Override "button" styles */
          min-height: auto;
          padding: 0;
        }

        .btn {
          height: 100%;
          /* Override "button" styles */
          min-height: auto;
          padding: 0;
        }

        .button-switch__track {
          background: #eee;
          width: 100%;
          height: 100%;
        }

        .button-switch__thumb {
          background: #ccc;
          width: 50%;
          height: 100%;
          position: absolute;
          top: 0;
        }

        :host([checked]) .button-switch__thumb {
          right: 0;
        }
      `,
    ];
  }

  // eslint-disable-next-line class-methods-use-this
  _renderBefore() {
    return html`
      <div class="button-switch__track"></div>
      <div class="button-switch__thumb"></div>
    `;
  }

  constructor() {
    super();
    this.role = 'switch';
    this.checked = false;
    this.addEventListener('click', this.__handleToggleStateChange);
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('aria-checked', `${this.checked}`);
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.removeAttribute('type');
  }

  __handleToggleStateChange() {
    if (this.disabled) {
      return;
    }
    this.checked = !this.checked;
    this.dispatchEvent(
      new Event('checked-changed', {
        composed: true,
        bubbles: true,
      }),
    );
  }

  /**
   * We synchronously update aria-checked to support voice over on safari.
   *
   * @override
   */
  _requestUpdate(name, oldValue) {
    super._requestUpdate(name, oldValue);
    if (this.isConnected && name === 'checked') {
      this.setAttribute('aria-checked', `${this.checked}`);
    }
  }
}
