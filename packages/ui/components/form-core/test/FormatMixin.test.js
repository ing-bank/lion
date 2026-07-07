import { runFormatMixinSuite } from '../test-suites/FormatMixin.suite.js';

runFormatMixinSuite({
  tagString: null,
  modelValueType: String,
  valueToggler: ({ toggleValue }) => (!toggleValue ? 'test-value-1' : 'test-value-2'),
  getExpectedInitialModelValue: () => '',
  getExpectedInitialFormattedValue: () => '',
  getExpectedInitialSerializedValue: () => '',
  valueChangeCounterOffset: 0,
});
