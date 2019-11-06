import { expect, fixture, defineCE } from '@open-wc/testing';
import { LionField } from '../src/LionField.js';

import { FieldCustomMixin } from '../src/FieldCustomMixin.js';

describe('FieldCustomMixin', () => {
  const inputSlot = '<input slot="input" />';
  let elem;

  before(async () => {
    const FieldCustomMixinClass = class extends FieldCustomMixin(LionField) {
      static get properties() {
        return {
          modelValue: {
            type: String,
          },
        };
      }
    };
    elem = defineCE(FieldCustomMixinClass);
  });

  it('has the capability to disable help text', async () => {
    const lionField = await fixture(`
      <${elem} disable-help-text>${inputSlot}</${elem}>
    `);
    expect(lionField.querySelector('[slot=help-text]')).to.equal(null);
  });
});
