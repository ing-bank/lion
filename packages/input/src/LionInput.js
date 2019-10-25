import { LionField } from '@lion/field';

/**
 * LionInput: extension of lion-field with native input element in place and user friendly API
 *
 * @customElement
 * @extends LionField
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
      step: {
        type: Number,
        reflect: true,
      },
    };
  }

  get slots() {
    return {
      ...super.slots,
      input: () => {
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
    /**
     * Only application to type="amount" & type="range"
     *
     * @deprecated
     */
    this.step = undefined;
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
      this.inputElement.type = this.type;
    }
    if (changedProps.has('step')) {
      this.inputElement.step = this.step;
    }
  }

  __delegateReadOnly() {
    if (this.inputElement) {
      this.inputElement.readOnly = this.readOnly;
    }
  }
}
