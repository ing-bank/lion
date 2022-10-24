import { LionField, NativeTextFieldMixin } from '@lion/ui/form-core.js';

/**
 * LionInput: extension of lion-field with native input element in place and user friendly API.
 *
 * @customElement lion-input
 */
export class LionInput extends NativeTextFieldMixin(LionField) {
  /** @type {any} */
  static get properties() {
    return {
      /**
       * A Boolean attribute which, if present, indicates that the user should not be able to edit
       * the value of the input. The difference between disabled and readonly is that read-only
       * controls can still function, whereas disabled controls generally do not function as
       * controls until they are enabled.
       *
       * (From: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly)
       */
      readOnly: {
        type: Boolean,
        attribute: 'readonly',
        reflect: true,
      },
      type: {
        type: String,
        reflect: true,
      },
      placeholder: {
        type: String,
        reflect: true,
      },
    };
  }

  get slots() {
    return {
      ...super.slots,
      input: () => {
        // TODO: Find a better way to do value delegation via attr
        const native = document.createElement('input');
        const value = this.getAttribute('value');
        if (value) {
          native.setAttribute('value', value);
        }
        return native;
      },
    };
  }

  /**
   * @type {HTMLInputElement}
   * @protected
   */
  get _inputNode() {
    return /** @type {HTMLInputElement} */ (super._inputNode); // casts type
  }

  constructor() {
    super();
    this.readOnly = false;
    this.type = 'text';
    this.placeholder = '';
  }

  /**
   * @param {PropertyKey} [name]
   * @param {?} [oldValue]
   */
  requestUpdate(name, oldValue) {
    super.requestUpdate(name, oldValue);
    if (name === 'readOnly') {
      this.__delegateReadOnly();
    }
  }

  /** @param {import('@lion/core').PropertyValues } changedProperties */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.__delegateReadOnly();
  }

  /** @param {import('@lion/core').PropertyValues } changedProperties */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('type')) {
      this._inputNode.type = this.type;
    }

    if (changedProperties.has('placeholder')) {
      this._inputNode.placeholder = this.placeholder;
    }

    if (changedProperties.has('disabled')) {
      this._inputNode.disabled = this.disabled;
      this.validate();
    }

    if (changedProperties.has('name')) {
      this._inputNode.name = this.name;
    }

    if (changedProperties.has('autocomplete')) {
      this._inputNode.autocomplete = /** @type {string} */ (this.autocomplete);
    }
  }

  /** @private */
  __delegateReadOnly() {
    if (this._inputNode) {
      this._inputNode.readOnly = this.readOnly;
    }
  }
}
