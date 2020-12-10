import { LionCheckbox } from './LionCheckbox.js';

export class LionCheckboxIndeterminate extends LionCheckbox {
  static get properties() {
    return {
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

  _ownModelValueChanged(ev) {
    if (ev.target === this) {
      this._subCheckboxes.forEach(checkbox => {
        // eslint-disable-next-line no-param-reassign
        checkbox.checked = this.checked;
      });
    }
  }

  constructor() {
    super();
    this.indeterminate = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._checkboxGroupNode.addEventListener(
      'model-value-changed',
      this._parentModelValueChanged.bind(this),
    );
    this.addEventListener('model-value-changed', this._ownModelValueChanged);
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('indeterminate')) {
      this._inputNode.indeterminate = this.indeterminate;
    }
  }
}
