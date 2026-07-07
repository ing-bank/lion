import {
  runFormatMixinSuite,
  runInteractionStateMixinSuite,
  runNativeTextFieldMixinSuite,
} from '@lion/ui/form-core-test-suites.js';

import '@lion/ui/define/lion-textarea.js';

const tagString = 'lion-textarea';

describe('<lion-textarea> integrations', () => {
  runInteractionStateMixinSuite({
    tagString,
  });

  runFormatMixinSuite({
    tagString,
    modelValueType: String,
    valueToggler: ({ toggleValue }) => (!toggleValue ? 'textarea-value-1' : 'textarea-value-2'),
    getExpectedInitialModelValue: () => '',
    getExpectedInitialFormattedValue: () => '',
    getExpectedInitialSerializedValue: () => '',
    valueChangeCounterOffset: 0,
  });

  runNativeTextFieldMixinSuite({
    tagString,
  });
});
