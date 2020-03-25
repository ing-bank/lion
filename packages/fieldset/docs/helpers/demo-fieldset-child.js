import { LionField } from '@lion/field';

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
