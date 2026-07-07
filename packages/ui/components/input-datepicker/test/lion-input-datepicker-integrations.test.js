import {
  runFormatMixinSuite,
  runInteractionStateMixinSuite,
} from '@lion/ui/form-core-test-suites.js';
import { parseDate } from '@lion/ui/localize-no-side-effects.js';

import '@lion/ui/define/lion-input-datepicker.js';

const tagString = 'lion-input-datepicker';
describe('<lion-input-datepicker> integrations', () => {
  runInteractionStateMixinSuite({
    tagString,
    allowedModelValueTypes: [Date],
  });

  runFormatMixinSuite({
    tagString,
    modelValueType: Date,
    valueToggler: ({ toggleValue, viewValue }) => {
      if (viewValue) {
        return !toggleValue ? '01/01/2020' : '02/02/2021';
      }
      return !toggleValue ? parseDate('01/01/2020') : parseDate('02/02/2021');
    },
    getExpectedInitialModelValue: () => '',
    getExpectedInitialFormattedValue: () => '',
    getExpectedInitialSerializedValue: () => '',
    valueChangeCounterOffset: 1,
  });
});
