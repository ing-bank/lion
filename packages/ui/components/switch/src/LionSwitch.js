import { css, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { ChoiceInputMixin, LionField } from '@lion/ui/form-core.js';
import { LionSwitchButton } from './LionSwitchButton.js';

export class LionSwitch extends ScopedElementsMixin(ChoiceInputMixin(LionField)) {
  static get styles() {
    return [
      ...super.styles,
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

  /**
   * Input node here is the lion-switch-button, which is not compatible with LionField _inputNode --> HTMLInputElement
   * Therefore we do a full override and typecast to an intersection type that includes LionSwitchButton
   * @type {LionSwitchButton}
   * @protected
   */
  // @ts-ignore [editor]: prevents vscode from complaining
  get _inputNode() {
    return /** @type {LionSwitchButton} */ (
      Array.from(this.children).find(el => el.slot === 'input')
    );
  }

  get slots() {
    return {
      ...super.slots,
      input: () => {
        const btnEl = this.createScopedElement('lion-switch-button');
        btnEl.setAttribute('data-tag-name', 'lion-switch-button');
        return btnEl;
      },
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

  /** @protected */
  _groupOneTemplate() {
    return html`${this._labelTemplate()} ${this._helpTextTemplate()} ${this._feedbackTemplate()}`;
  }

  /** @protected */
  _groupTwoTemplate() {
    return html`${this._inputGroupTemplate()}`;
  }

  constructor() {
    super();
    this.checked = false;
    /** @private */
    this.__handleButtonSwitchCheckedChanged = this.__handleButtonSwitchCheckedChanged.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.role) {
      this.role = 'switch';
    }
    this.addEventListener('checked-changed', this.__handleButtonSwitchCheckedChanged);
    if (this._labelNode) {
      this._labelNode.addEventListener('click', this._toggleChecked);
    }
    this._syncButtonSwitch();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._inputNode) {
      this.removeEventListener('checked-changed', this.__handleButtonSwitchCheckedChanged);
    }
    if (this._labelNode) {
      this._labelNode.removeEventListener('click', this._toggleChecked);
    }
  }

  /** @param {import('lit').PropertyValues } changedProperties */
  updated(changedProperties) {
    super.updated(changedProperties);
    this._syncButtonSwitch();

    if (changedProperties.has('checked')) {
      this.setAttribute('aria-checked', this.checked ? 'true' : 'false');
    }
  }

  /**
   * Override this function from ChoiceInputMixin.
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _isEmpty() {
    return false;
  }

  /**
   * @private
   * @param {Event} ev
   */
  __handleButtonSwitchCheckedChanged(ev) {
    ev.stopPropagation();
    this._isHandlingUserInput = true;
    this.checked = this._inputNode.checked;
    this._isHandlingUserInput = false;
  }

  /** @protected */
  _syncButtonSwitch() {
    this._inputNode.disabled = this.disabled;
  }

  /**
   * @configure FormControlMixin
   * @protected
   */
  _onLabelClick() {
    if (this.disabled) {
      return;
    }
    this._inputNode.focus();
  }
}
