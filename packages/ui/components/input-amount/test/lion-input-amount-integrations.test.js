import {
  runFormatMixinSuite,
  runInteractionStateMixinSuite,
} from '@lion/ui/form-core-test-suites.js';

import '@lion/ui/define/lion-input-amount.js';

const tagString = 'lion-input-amount';

describe('<lion-input-amount> integrations', () => {
  runInteractionStateMixinSuite({
    tagString,
    allowedModelValueTypes: [Number],
  });

  runFormatMixinSuite({
    tagString,
    modelValueType: Number,
    valueToggler: ({ toggleValue, viewValue }) => {
      if (viewValue) {
        return !toggleValue ? '100' : '200';
      }
      return !toggleValue ? 100 : 200;
    },
    getExpectedInitialModelValue: () => '',
    getExpectedInitialFormattedValue: () => '',
    getExpectedInitialSerializedValue: () => '',
    valueChangeCounterOffset: 0,
  });
});
