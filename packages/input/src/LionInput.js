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
      },
    };
  }

  get delegations() {
    return {
      ...super.delegations,
      properties: [...super.delegations.properties, 'step'],
      attributes: [...super.delegations.attributes, 'step'],
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

  __delegateReadOnly() {
    if (this.inputElement) {
      this.inputElement.readOnly = this.readOnly;
    }
  }
}
