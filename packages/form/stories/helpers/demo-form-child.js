import { LionField } from '@lion/field';

customElements.define(
  'demo-form-child',
  class extends LionField {
    get slots() {
      return {
        ...super.slots,
        input: () => document.createElement('input'),
      };
    }
  },
);
