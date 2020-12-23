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
    return /** @type {import('./LionCheckboxGroup').LionCheckboxGroup} */ (this.parentElement);
  }

  get _subCheckboxes() {
    return this._checkboxGroupNode.formElements.filter(checkbox => checkbox !== this);
  }

  _parentModelValueChanged() {
    const checkedElements = this._subCheckboxes.filter(checkbox => checkbox.checked);
    switch (this._subCheckboxes.length - checkedElements.length) {
      // all checked
      case 0:
        this.indeterminate = false;
        this.checked = true;
        break;
      // none checked
      case this._subCheckboxes.length:
        this.indeterminate = false;
        this.checked = false;
        break;
      default:
        this.indeterminate = true;
    }
  }

  _ownInputChanged() {
    this._subCheckboxes.forEach(checkbox => {
      // eslint-disable-next-line no-param-reassign
      checkbox.checked = this._inputNode.checked;
    });
  }

  /**
   * @override
   * clicking on indeterminate status will set the status as checked
   */
  // eslint-disable-next-line class-methods-use-this
  __toggleChecked() {}

  // eslint-disable-next-line class-methods-use-this
  _afterTemplate() {
    return html`
    <div class"nestedCheckboxes">
      <slot></slot>
    </div>`;
  }

  constructor() {
    super();
    this.indeterminate = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._parentModelValueChanged = this._parentModelValueChanged.bind(this);
    this._checkboxGroupNode.addEventListener('model-value-changed', this._parentModelValueChanged);
    this._ownInputChanged = this._ownInputChanged.bind(this);
    this._inputNode.addEventListener('change', this._ownInputChanged.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._checkboxGroupNode.removeEventListener(
      'model-value-changed',
      this._parentModelValueChanged,
    );
    this._inputNode.removeEventListener('change', this._ownInputChanged);
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
        :host .nestedCheckboxes {
          display: block;
        }

        :host ::slotted(lion-checkbox) {
          padding-left: 8px;
        }
      `,
    ];
  }
}
