import { html, css } from '@lion/core';
import { LionField } from '@lion/field';
import { ChoiceInputMixin } from '@lion/choice-input';

import '../lion-switch-button.js';

export class LionSwitch extends ChoiceInputMixin(LionField) {
  static get styles() {
    return [
      super.styles,
      css`
        :host([disabled]) {
          color: #adadad;
        }
      `,
    ];
  }

  get slots() {
    return {
      ...super.slots,
      input: () => document.createElement('lion-switch-button'),
    };
  }

  render() {
    return html`
      <div class="input-switch__container">
        ${this.labelTemplate()} ${this.helpTextTemplate()} ${this.feedbackTemplate()}
      </div>
      ${this.inputGroupTemplate()}
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this._inputNode.addEventListener(
      'checked-changed',
      this.__handleButtonSwitchCheckedChanged.bind(this),
    );
    this._syncButtonSwitch();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    this._syncButtonSwitch();
  }

  __handleButtonSwitchCheckedChanged() {
    // TODO: should be replaced by "_inputNode" after the next breaking change
    // https://github.com/ing-bank/lion/blob/master/packages/field/src/FormControlMixin.js#L78
    this.checked = this._inputNode.checked;
  }

  _syncButtonSwitch() {
    this._inputNode.checked = this.checked;
    this._inputNode.disabled = this.disabled;
  }
}
