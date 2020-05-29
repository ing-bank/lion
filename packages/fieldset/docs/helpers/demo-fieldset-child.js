import { LionField } from '@lion/form-core';

customElements.define(
  'demo-fieldset-child',
  class extends LionField {
    get slots() {
      return {
        ...super.slots,
        input: () => document.createElement('input'),
      };
    }
  },
);
