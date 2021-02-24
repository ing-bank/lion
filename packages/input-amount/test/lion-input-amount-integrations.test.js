import { runInteractionStateMixinSuite, runFormatMixinSuite } from '@lion/form-core/test-suites';

import '@lion/input-amount/define';

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
