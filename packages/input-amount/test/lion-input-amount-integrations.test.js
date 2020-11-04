import { runInteractionStateMixinSuite } from '@lion/form-core/test-suites/InteractionStateMixin.suite.js';
import { runFormatMixinSuite } from '@lion/form-core/test-suites/FormatMixin.suite.js';
import '../lion-input-amount.js';

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
