import { html, css } from '@lion/core';
import { LionCheckbox } from './LionCheckbox.js';

/**
 * @typedef {import('./LionCheckboxGroup').LionCheckboxGroup} LionCheckboxGroup
 */

export class LionCheckboxIndeterminate extends LionCheckbox {
  static get styles() {
    return [
      ...(super.styles || []),
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
      mixedState: {
        type: Boolean,
        reflect: true,
        attribute: 'mixed-state',
      },
    };
  }

  /**
   * @protected
   */
  get _checkboxGroupNode() {
    return /** @type LionCheckboxGroup */ (this._parentFormGroup);
  }

  /**
   * @protected
   */
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

  _storeIndeterminateState() {
    this._indeterminateSubStates = this._subCheckboxes.map(checkbox => checkbox.checked);
  }

  _setOldState() {
    if (this.indeterminate) {
      this._oldState = 'indeterminate';
    } else {
      this._oldState = this.checked ? 'checked' : 'unchecked';
    }
  }

  /**
   * @protected
   */
  _setOwnCheckedState() {
    const subCheckboxes = this._subCheckboxes.filter(checkbox => !checkbox.disabled);
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

  _setBasedOnMixedState() {
    switch (this._oldState) {
      case 'checked':
        // --> unchecked
        this.checked = false;
        this.indeterminate = false;
        break;
      case 'unchecked':
        // --> indeterminate
        this.checked = false;
        this.indeterminate = true;
        break;
      case 'indeterminate':
        // --> checked
        this.checked = true;
        this.indeterminate = false;
        break;
      // no default
    }
  }

  /**
   * @param {Event} ev
   * @private
   */
  __onModelValueChanged(ev) {
    if (this.disabled) {
      return;
    }
    const _ev = /** @type {CustomEvent} */ (ev);

    // If the model value change event is coming from out own _inputNode
    // and we're not already setting our own (mixed) state programmatically
    if (_ev.detail.formPath[0] === this && !this.__settingOwnChecked) {
      const allEqual = (/** @type {any[]} */ arr) => arr.every(val => val === arr[0]);
      // If our child checkboxes states are all the same, we shouldn't be able to reach indeterminate (mixed) state
      if (this.mixedState && !allEqual(this._indeterminateSubStates)) {
        this._setBasedOnMixedState();
      }

      this.__settingOwnSubs = true;
      if (this.indeterminate && this.mixedState) {
        this._subCheckboxes.forEach((checkbox, i) => {
          // eslint-disable-next-line no-param-reassign
          checkbox.checked = this._indeterminateSubStates[i];
        });
      } else {
        this._subCheckboxes.forEach(checkbox => {
          // eslint-disable-next-line no-param-reassign
          checkbox.checked = this._inputNode.checked;
        });
      }
      this.updateComplete.then(() => {
        this.__settingOwnSubs = false;
      });
    } else {
      this._setOwnCheckedState();
      this.updateComplete.then(() => {
        if (!this.__settingOwnSubs && !this.__settingOwnChecked && this.mixedState) {
          this._storeIndeterminateState();
        }
      });
    }

    if (this.mixedState) {
      this._setOldState();
    }
  }

  /**
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _afterTemplate() {
    return html`
      <div class="choice-field__nested-checkboxes">
        <slot name="checkbox"></slot>
      </div>
    `;
  }

  /**
   * @protected
   */
  _onRequestToAddFormElement() {
    this._setOwnCheckedState();
  }

  constructor() {
    super();
    this.indeterminate = false;
    this._onRequestToAddFormElement = this._onRequestToAddFormElement.bind(this);
    this.__onModelValueChanged = this.__onModelValueChanged.bind(this);
    /** @type {boolean[]} */
    this._indeterminateSubStates = [];
    this.mixedState = false;
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
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this._setOldState();
    if (this.indeterminate) {
      this._storeIndeterminateState();
    }
  }

  /** @param {import('lit-element').PropertyValues } changedProperties */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('indeterminate')) {
      this._inputNode.indeterminate = this.indeterminate;
    }
  }
}
