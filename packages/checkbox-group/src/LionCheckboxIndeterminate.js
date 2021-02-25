import { html, css } from '@lion/core';
import { LionCheckbox } from './LionCheckbox.js';

/**
 * @typedef {import('./LionCheckboxGroup').LionCheckboxGroup} LionCheckboxGroup
 */

export class LionCheckboxIndeterminate extends LionCheckbox {
  static get styles() {
    return [
      super.styles || [],
      css`
        :host .choice-field__nested-checkboxes {
          display: block;
        }

        ::slotted([slot='checkbox']) {
          padding-left: 8px;
        }
      `,
    ];
  }

  /** @type {any} */
  static get properties() {
    return {
      /**
       * Indeterminate state of the checkbox
       */
      indeterminate: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  get _checkboxGroupNode() {
    return /** @type LionCheckboxGroup */ (this._parentFormGroup);
  }

  get _subCheckboxes() {
    let checkboxes = [];
    if (
      this._checkboxGroupNode &&
      this._checkboxGroupNode.formElements &&
      this._checkboxGroupNode.formElements.length > 0
    ) {
      checkboxes = this._checkboxGroupNode.formElements.filter(
        checkbox => checkbox !== this && this.contains(checkbox),
      );
    }
    return /** @type LionCheckbox[] */ (checkboxes);
  }

  _setOwnCheckedState() {
    const subCheckboxes = this._subCheckboxes;
    if (!subCheckboxes.length) {
      return;
    }

    this.__settingOwnChecked = true;
    const checkedElements = subCheckboxes.filter(checkbox => checkbox.checked);
    switch (subCheckboxes.length - checkedElements.length) {
      // all checked
      case 0:
        this.indeterminate = false;
        this.checked = true;
        break;
      // none checked
      case subCheckboxes.length:
        this.indeterminate = false;
        this.checked = false;
        break;
      default:
        this.indeterminate = true;
        this.checked = false;
    }
    this.updateComplete.then(() => {
      this.__settingOwnChecked = false;
    });
  }

  /**
   * @param {Event} ev
   */
  __onModelValueChanged(ev) {
    if (this.disabled) {
      return;
    }

    const _ev = /** @type {CustomEvent} */ (ev);
    if (_ev.detail.formPath[0] === this && !this.__settingOwnChecked) {
      this._subCheckboxes.forEach(checkbox => {
        // eslint-disable-next-line no-param-reassign
        checkbox.checked = this._inputNode.checked;
      });
    }
    this._setOwnCheckedState();
  }

  // eslint-disable-next-line class-methods-use-this
  _afterTemplate() {
    return html`
      <div class="choice-field__nested-checkboxes">
        <slot name="checkbox"></slot>
      </div>
    `;
  }

  _onRequestToAddFormElement() {
    this._setOwnCheckedState();
  }

  constructor() {
    super();
    this.indeterminate = false;
    this._onRequestToAddFormElement = this._onRequestToAddFormElement.bind(this);
    this.__onModelValueChanged = this.__onModelValueChanged.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('model-value-changed', this.__onModelValueChanged);
    this.addEventListener('form-element-register', this._onRequestToAddFormElement);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('model-value-changed', this.__onModelValueChanged);
    this.removeEventListener('form-element-register', this._onRequestToAddFormElement);
  }

  /** @param {import('lit-element').PropertyValues } changedProperties */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('indeterminate')) {
      this._inputNode.indeterminate = this.indeterminate;
    }
  }
}
