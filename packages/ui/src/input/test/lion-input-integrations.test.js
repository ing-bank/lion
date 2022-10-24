import {
  runInteractionStateMixinSuite,
  runFormatMixinSuite,
} from '@lion/ui/form-core-test-suites.js';

import '@lion/ui/define/lion-input.js';

const tagString = 'lion-input';

describe('<lion-input> integrations', () => {
  runInteractionStateMixinSuite({
    tagString,
  });

  runFormatMixinSuite({
    tagString,
  });
});
