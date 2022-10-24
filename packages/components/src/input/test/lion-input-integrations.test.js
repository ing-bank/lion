import {
  runInteractionStateMixinSuite,
  runFormatMixinSuite,
} from '@lion/components/form-core-test-suites.js';

import '@lion/components/define/lion-input.js';

const tagString = 'lion-input';

describe('<lion-input> integrations', () => {
  runInteractionStateMixinSuite({
    tagString,
  });

  runFormatMixinSuite({
    tagString,
  });
});
