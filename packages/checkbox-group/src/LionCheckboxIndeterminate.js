import { html, css } from '@lion/core';
import { LionCheckbox } from './LionCheckbox.js';

export class LionCheckboxIndeterminate extends LionCheckbox {
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
    return /** @type {import('./LionCheckboxGroup').LionCheckboxGroup} */ (this.__parentFormGroup);
  }

  get _subCheckboxes() {
    return this._checkboxGroupNode.formElements.filter(cb => cb !== this && this.contains(cb));
  }

  /**
   * @param {CustomEvent} event
   */
  _parentModelValueChanged(event) {
    const checkedElements = this._subCheckboxes.filter(checkbox => checkbox.checked);
    switch (this._subCheckboxes.length - checkedElements.length) {
      // all checked
      case 0:
        this.indeterminate = false;
        this.checked = true;
        if (event.detail.isTriggeredByUser) {
          this.__prevState = undefined;
        }
        break;
      // none checked
      case this._subCheckboxes.length:
        this.indeterminate = false;
        this.checked = false;
        if (event.detail.isTriggeredByUser) {
          this.__prevState = undefined;
        }
        break;
      default:
        this.indeterminate = true;
    }
  }

  /**
   * @param {boolean|boolean[]|undefined} newValues
   */
  __setSubCheckboxes(newValues = true) {
    this._subCheckboxes.forEach((cb, i) => {
      // eslint-disable-next-line no-param-reassign
      cb.checked = Array.isArray(newValues) ? newValues[i] : newValues;
    });
  }

  _ownInputChanged() {
    // Toggle between three states (mixed, true, false). See:
    // https://www.w3.org/TR/wai-aria-practices-1.1/examples/checkbox/checkbox-2/checkbox-2.html
    if (this.indeterminate) {
      // Equivalent of aria-checked='mixed' => store the prev state first and set all true
      this.__prevState = this._subCheckboxes.map(cb => cb.checked);
      this.__setSubCheckboxes(true);
    } else if (this.checked) {
      // Equivalent of aria-checked='true' => set all false
      this.__setSubCheckboxes(false);
    } else {
      // Equivalent of aria-checked='false' => restore the prev state
      this.indeterminate = true;
      this.__setSubCheckboxes(this.__prevState);
    }
  }

  /**
   * @override
   * clicking on indeterminate status will set the status as checked
   * @param {Event} event
   */
  __toggleChecked({ target }) {
    if (this.disabled || target !== this) {
      return;
    }
    this.checked = !this.checked;
    this._ownInputChanged();
  }

  connectedCallback() {
    super.connectedCallback();
    this._parentModelValueChanged = this._parentModelValueChanged.bind(this);
    this._checkboxGroupNode.addEventListener('model-value-changed', this._parentModelValueChanged);
    this._ownInputChanged = this._ownInputChanged.bind(this);
    this._inputNode.addEventListener('click', this.__preventToggleOnReadOnly);
  }

  /**
   * @param {Event} event
   */
  // eslint-disable-next-line class-methods-use-this
  __preventToggleOnReadOnly(event) {
    if (this.readOnly) {
      event.preventDefault();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _afterTemplate() {
    return html` <div class="choice-field__indeterminate-checkboxes">
      <slot></slot>
    </div>`;
  }

  constructor() {
    super();
    this.indeterminate = false;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._checkboxGroupNode.removeEventListener(
      'model-value-changed',
      this._parentModelValueChanged,
    );
    // this._inputNode.removeEventListener('change', this._ownInputChanged);
    this._inputNode.removeEventListener('click', this.__preventToggleOnReadOnly);
  }

  /** @param {import('lit-element').PropertyValues } changedProperties */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('indeterminate')) {
      this._inputNode.indeterminate = this.indeterminate;
    }
  }

  static get styles() {
    const superCtor = /** @type {typeof LionCheckbox} */ (super.prototype.constructor);
    return [
      superCtor.styles ? superCtor.styles : [],
      css`
        :host .choice-field__indeterminate-checkboxes {
          display: block;
          margin-left: 8px;
        }
      `,
    ];
  }
}
