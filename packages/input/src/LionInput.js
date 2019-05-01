import { LionField } from '@lion/field';

/**
 * LionInput: extension of lion-field with native input element in place and user friendly API
 *
 * @customElement
 * @extends LionField
 */
export class LionInput extends LionField {
  get delegations() {
    return {
      ...super.delegations,
      target: () => this.inputElement,
      properties: [...super.delegations.properties, 'readOnly'],
      attributes: [...super.delegations.attributes, 'readonly'],
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
}
