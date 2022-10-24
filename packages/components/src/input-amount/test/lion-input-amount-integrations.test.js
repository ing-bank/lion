import {
  runInteractionStateMixinSuite,
  runFormatMixinSuite,
} from '@lion/components/form-core-test-suites.js';

import '@lion/components/define/lion-input-amount.js';

const tagString = 'lion-input-amount';

describe('<lion-input-amount> integrations', () => {
  runInteractionStateMixinSuite({
    tagString,
    allowedModelValueTypes: [Number],
  });

  runFormatMixinSuite({
    tagString,
    modelValueType: Number,
  });
});
