import '@lion/ui/define/lion-input-iban.js';
import { runFormatMixinSuite } from '@lion/ui/form-core-test-suites.js';

const tagString = 'lion-input-iban';

describe('<lion-input-iban> integrations', () => {
  runFormatMixinSuite({
    tagString,
    modelValueType: 'iban',
    valueToggler: ({ toggleValue }) =>
      !toggleValue ? 'SE3550000000054910000003' : 'CH9300762011623852957',
    getExpectedInitialModelValue: () => '',
    getExpectedInitialFormattedValue: () => '',
    getExpectedInitialSerializedValue: () => '',
    valueChangeCounterOffset: 0,
  });
});
