import {
  runInteractionStateMixinSuite,
  runFormatMixinSuite,
} from '@lion/ui/form-core-test-suites.js';

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
  });
});
