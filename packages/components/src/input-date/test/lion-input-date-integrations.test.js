import {
  runInteractionStateMixinSuite,
  runFormatMixinSuite,
} from '@lion/components/form-core-test-suites.js';

import '@lion/components/define/lion-input-date.js';

const tagString = 'lion-input-date';
describe('<lion-input-date> integrations', () => {
  runInteractionStateMixinSuite({
    tagString,
    allowedModelValueTypes: [Date],
  });

  runFormatMixinSuite({
    tagString,
    modelValueType: Date,
  });
});
