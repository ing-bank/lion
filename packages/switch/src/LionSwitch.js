import { html, css, ScopedElementsMixin, getScopedTagName } from '@lion/core';
import { LionField } from '@lion/field';
import { ChoiceInputMixin } from '@lion/choice-input';
import { LionSwitchButton } from './LionSwitchButton.js';

export class LionSwitch extends ScopedElementsMixin(ChoiceInputMixin(LionField)) {
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

  static get scopedElements() {
    return {
      ...super.scopedElements,
      'lion-switch-button': LionSwitchButton,
    };
  }

  get slots() {
    return {
      ...super.slots,
      input: () =>
        document.createElement(
          getScopedTagName('lion-switch-button', this.constructor.scopedElements),
        ),
    };
  }

  /**
   * Restore original render function from FormControlMixin.js
   * As it gets overwritten in ChoiceInputMixin
   */
  render() {
    return html`
      <div class="form-field__group-one">
        ${this.groupOneTemplate()}
      </div>
      <div class="form-field__group-two">
        ${this.groupTwoTemplate()}
      </div>
    `;
  }

  groupOneTemplate() {
    return html`
      ${this.labelTemplate()} ${this.helpTextTemplate()} ${this.feedbackTemplate()}
    `;
  }

  groupTwoTemplate() {
    return html`
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
    this.submitted = true;
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    this._syncButtonSwitch();
  }

  /**
   * Override this function from ChoiceInputMixin
   */
  // eslint-disable-next-line class-methods-use-this
  _isEmpty() {}

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
