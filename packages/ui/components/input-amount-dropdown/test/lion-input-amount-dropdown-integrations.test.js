import { runFormatMixinSuite } from '@lion/ui/form-core-test-suites.js';

import { LionInputAmountDropdown } from '@lion/ui/input-amount-dropdown.js';
import '@lion/ui/define/lion-input-amount-dropdown.js';

describe('<lion-input-amount-dropdown> integrations', () => {
  runFormatMixinSuite({
    classes: { host: LionInputAmountDropdown },
    modelValueType: Object,
    parser: value => value.replace('foo: ', ''),
    valueToggler: ({ toggleValue, viewValue }) => {
      if (viewValue) {
        return !toggleValue ? '123' : '456';
      }
      return !toggleValue ? { amount: 123, currency: 'EUR' } : { amount: 456, currency: 'EUR' };
    },
    getExpectedInitialModelValue: el => ({
      currency: /** @type {any} */ (el).currency,
      amount: '',
    }),
    getExpectedInitialFormattedValue: el => ({
      currency: /** @type {any} */ (el).currency,
      amount: '',
    }),
    getExpectedInitialSerializedValue: el => ({
      currency: /** @type {any} */ (el).currency,
      amount: '',
    }),
    getExpectedModelValueForEmptyInputNode: el => ({
      currency: /** @type {any} */ (el).currency,
      amount: '',
    }),
    valueChangeCounterOffset: 0,
  });
});
