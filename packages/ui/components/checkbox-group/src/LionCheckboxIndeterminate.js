import { html, css } from 'lit';
import { LionCheckbox } from './LionCheckbox.js';

/**
 * @typedef {import('./LionCheckboxGroup.js').LionCheckboxGroup} LionCheckboxGroup
 */

export class LionCheckboxIndeterminate extends LionCheckbox {
  static get styles() {
    return [
      ...(super.styles || []),
      css`
        :host .choice-field__nested-checkboxes {
          display: block;
        }
        ::slotted(*) {
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
      forceSyncIndeterminate: {
        type: Number,
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
      if (this._checkboxGroupNode.formElements.includes(this.__temporaryRegisteredElement)) {
        this.__temporaryRegisteredElement = undefined;
      }
    }
    return /** @type LionCheckbox[] */ (
      this.__temporaryRegisteredElement === undefined
        ? checkboxes
        : [...checkboxes, this.__temporaryRegisteredElement]
    );
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
      default: {
        this.indeterminate = true;

        // When 1. sub checkboxes have disabled elements and 2. one or more elements are checked
        // both this._inputNode.indeterminate and this.indeterminate are already true.
        // If user clicks the input node, this._inputNode.indeterminate is turned to false by the browser
        // while this.indeterminate is still true and the 'indeterminate' is not in the changedProperties
        // when updated callback is called because it hasn't updated (true -> true).
        // Hence we have to force syncing the indeterminate state between the properties and the DOM's attribute.
        this.forceSyncIndeterminate += 1;

        const disabledElements = subCheckboxes.filter(checkbox => checkbox.disabled);
        this.checked =
          subCheckboxes.length - checkedElements.length - disabledElements.length === 0;
      }
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

      const subCheckboxes = this._subCheckboxes;
      const checkedElements = subCheckboxes.filter(checkbox => checkbox.checked);
      const disabledElements = subCheckboxes.filter(checkbox => checkbox.disabled);
      const allChecked =
        subCheckboxes.length > 0 && subCheckboxes.length === checkedElements.length;
      const allDisabled =
        subCheckboxes.length > 0 && subCheckboxes.length === disabledElements.length;

      if (allDisabled) {
        this.checked = allChecked;
      }

      if (this.indeterminate && this.mixedState) {
        this._subCheckboxes.forEach((checkbox, i) => {
          // eslint-disable-next-line no-param-reassign
          checkbox.checked = this._indeterminateSubStates[i];
        });
      } else {
        this._subCheckboxes
          .filter(checkbox => !checkbox.disabled)
          .forEach(checkbox => {
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
      <div class="choice-field__nested-checkboxes" role="list">
        <slot></slot>
      </div>
    `;
  }

  /**
   * @param {CustomEvent} ev
   * @protected
   */
  _onRequestToAddFormElement(ev) {
    if (!(/** @type {HTMLElement} */ (ev.target).hasAttribute('role'))) {
      /** @type {HTMLElement} */ (ev.target)?.setAttribute('role', 'listitem');
    }
    // At this moment, the form-element-register event hasn't reached the parent form group
    // hence its formElements doesn't include the element that was just registered.
    // We save the element in a temporary variable to help _subCheckboxes to include the element
    // and _setOwnCheckedState works as expected.
    this.__temporaryRegisteredElement = ev.detail.element;
    this._setOwnCheckedState();
  }

  /**
   * @param {Event} ev
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _onRequestToRemoveFormElement(ev) {
    if (/** @type {HTMLElement} */ (ev.target).getAttribute('role') === 'listitem') {
      /** @type {HTMLElement} */ (ev.target)?.removeAttribute('role');
    }
  }

  constructor() {
    super();
    this.indeterminate = false;
    this.forceSyncIndeterminate = 0;
    this._onRequestToAddFormElement = this._onRequestToAddFormElement.bind(this);
    this.__onModelValueChanged = this.__onModelValueChanged.bind(this);
    this.__temporaryRegisteredElement = undefined;
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
    if (changedProperties.has('indeterminate') || changedProperties.has('forceSyncIndeterminate')) {
      this._inputNode.indeterminate = this.indeterminate;
    }
  }
}
