import { runFormatMixinSuite } from '@lion/ui/form-core-test-suites.js';

import '@lion/ui/define/lion-input-amount-dropdown.js';

const tagString = 'lion-input-amount-dropdown';

describe('<lion-input-amount-dropdown> integrations', () => {
  runFormatMixinSuite({
    tagString,
    modelValueType: Object,
    valueToggler: ({ toggleValue, viewValue }) => {
      if (viewValue) {
        return !toggleValue ? '123' : '456';
      }
      return !toggleValue ? { amount: 123, currency: 'EUR' } : { amount: 456, currency: 'EUR' };
    },
    getExpectedInitialModelValue: el => ({ currency: /** @type {any} */ (el).currency }),
    getExpectedInitialFormattedValue: el => ({ currency: /** @type {any} */ (el).currency }),
    getExpectedInitialSerializedValue: el => ({ currency: /** @type {any} */ (el).currency }),
    valueChangeCounterOffset: 0,
  });
});
