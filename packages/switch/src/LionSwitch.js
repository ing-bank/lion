import { css, html, ScopedElementsMixin } from '@lion/core';
import { ChoiceInputMixin, LionField } from '@lion/form-core';
import { LionSwitchButton } from './LionSwitchButton.js';

export class LionSwitch extends ScopedElementsMixin(ChoiceInputMixin(LionField)) {
  static get styles() {
    return [
      super.styles,
      css`
        :host([hidden]) {
          display: none;
        }

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
      input: () => document.createElement(this.constructor.getScopedTagName('lion-switch-button')),
    };
  }

  /**
   * Restore original render function from FormControlMixin.js
   * As it gets overwritten in ChoiceInputMixin
   */
  render() {
    return html`
      <div class="form-field__group-one">${this._groupOneTemplate()}</div>
      <div class="form-field__group-two">${this._groupTwoTemplate()}</div>
    `;
  }

  _groupOneTemplate() {
    return html`${this._labelTemplate()} ${this._helpTextTemplate()} ${this._feedbackTemplate()}`;
  }

  _groupTwoTemplate() {
    return html`${this._inputGroupTemplate()}`;
  }

  constructor() {
    super();
    this.role = 'switch';
    this.checked = false;
    this.__handleButtonSwitchCheckedChanged = this.__handleButtonSwitchCheckedChanged.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    if (this._inputNode) {
      this._inputNode.addEventListener('checked-changed', this.__handleButtonSwitchCheckedChanged);
    }
    if (this._labelNode) {
      this._labelNode.addEventListener('click', this.__toggleChecked);
    }
    this._syncButtonSwitch();
    this.submitted = true;
  }

  disconnectedCallback() {
    if (this._inputNode) {
      this._inputNode.removeEventListener(
        'checked-changed',
        this.__handleButtonSwitchCheckedChanged,
      );
    }
    if (this._labelNode) {
      this._labelNode.removeEventListener('click', this.__toggleChecked);
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    this._syncButtonSwitch();
  }

  /**
   * Override this function from ChoiceInputMixin.
   */
  // eslint-disable-next-line class-methods-use-this
  _isEmpty() {}

  __handleButtonSwitchCheckedChanged() {
    this.checked = this._inputNode.checked;
  }

  _syncButtonSwitch() {
    this._inputNode.disabled = this.disabled;
  }
}
