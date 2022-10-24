import {
  runInteractionStateMixinSuite,
  runFormatMixinSuite,
} from '@lion/components/form-core-test-suites.js';

import '@lion/components/define/lion-input-datepicker.js';

const tagString = 'lion-input-datepicker';
describe('<lion-input-datepicker> integrations', () => {
  runInteractionStateMixinSuite({
    tagString,
    allowedModelValueTypes: [Date],
  });

  runFormatMixinSuite({
    tagString,
    modelValueType: Date,
  });
});
