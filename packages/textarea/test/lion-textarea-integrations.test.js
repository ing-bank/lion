import {
  runInteractionStateMixinSuite,
  runFormatMixinSuite,
  runNativeTextFieldMixinSuite,
} from '@lion/form-core/test-suites';

import '@lion/textarea/define';

const tagString = 'lion-textarea';

describe('<lion-textarea> integrations', () => {
  runInteractionStateMixinSuite({
    tagString,
  });

  runFormatMixinSuite({
    tagString,
  });

  runNativeTextFieldMixinSuite({
    tagString,
  });
});
