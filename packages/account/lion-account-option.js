/* eslint-disable */
import { LionOption } from '@lion/option';
import { html } from '@lion/core';

export class LionAccountOption extends LionOption {
  static get styles() {
    return [super.styles];
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this.__unRegisterEventListeners();
    this.__registerEventListeners();
  }

  updated(c) {
    super.updated(c);

    if (c.has('modelValue')) {
      // smth
    }
  }

  render() {
    return html`
      <div class="option-account choice-field__label">
        <div class="option-account__icon"></div>
        <div class="option-account__amount">
          ${this.modelValue.value.currencyAmount}
        </div>
        <div class="option-account__iban">
          ${this.modelValue.value.iban}
        </div>
        <div class="option-account__chevron"></div>
      </div>
    `;
  }
}
customElements.define('lion-account-option', LionAccountOption);
