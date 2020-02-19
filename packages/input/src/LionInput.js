import { LionField } from '@lion/field';

/**
 * LionInput: extension of lion-field with native input element in place and user friendly API
 *
 * @customElement lion-input
 * @extends {LionField}
 */
export class LionInput extends LionField {
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
        if (this.__dataInstanceProps && this.__dataInstanceProps.modelValue) {
          native.setAttribute('value', this.__dataInstanceProps.modelValue);
        } else if (this.hasAttribute('value')) {
          native.setAttribute('value', this.getAttribute('value'));
        }
        return native;
      },
    };
  }

  constructor() {
    super();
    this.readOnly = false;
    this.type = 'text';
  }

  _requestUpdate(name, oldValue) {
    super._requestUpdate(name, oldValue);
    if (name === 'readOnly') {
      this.__delegateReadOnly();
    }
  }

  firstUpdated(c) {
    super.firstUpdated(c);
    this.__delegateReadOnly();
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('type')) {
      this._inputNode.type = this.type;
    }
    if (changedProps.has('placeholder')) {
      this._inputNode.placeholder = this.placeholder;
    }
  }

  __delegateReadOnly() {
    if (this._inputNode) {
      this._inputNode.readOnly = this.readOnly;
    }
  }
}
