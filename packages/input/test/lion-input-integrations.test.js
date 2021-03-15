import { runInteractionStateMixinSuite, runFormatMixinSuite } from '@lion/form-core/test-suites';

import '@lion/input/define';

const tagString = 'lion-input';

describe('<lion-input> integrations', () => {
  runInteractionStateMixinSuite({
    tagString,
  });

  runFormatMixinSuite({
    tagString,
  });
});
