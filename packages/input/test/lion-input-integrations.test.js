import { runInteractionStateMixinSuite } from '@lion/form-core/test-suites/InteractionStateMixin.suite.js';
import { runFormatMixinSuite } from '@lion/form-core/test-suites/FormatMixin.suite.js';
import '../lion-input.js';

const tagString = 'lion-input';

describe('<lion-input> integrations', () => {
  runInteractionStateMixinSuite({
    tagString,
    suffix: 'lion-input',
  });

  runFormatMixinSuite({
    tagString,
  });
});
