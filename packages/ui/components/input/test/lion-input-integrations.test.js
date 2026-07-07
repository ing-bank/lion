import {
  runFormatMixinSuite,
  runInteractionStateMixinSuite,
} from '@lion/ui/form-core-test-suites.js';

import '@lion/ui/define/lion-input.js';

const tagString = 'lion-input';

describe('<lion-input> integrations', () => {
  runInteractionStateMixinSuite({
    tagString,
  });

  runFormatMixinSuite({
    tagString,
    modelValueType: String,
    valueToggler: ({ toggleValue }) => (!toggleValue ? 'lion-input-value-1' : 'lion-input-value-2'),
    getExpectedInitialModelValue: () => '',
    getExpectedInitialFormattedValue: () => '',
    getExpectedInitialSerializedValue: () => '',
    valueChangeCounterOffset: 0,
  });
});
