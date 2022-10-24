import {
  runInteractionStateMixinSuite,
  runFormatMixinSuite,
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
  });
});
