import {
  runInteractionStateMixinSuite,
  runFormatMixinSuite,
  runNativeTextFieldMixinSuite,
} from '@lion/ui/form-core-test-suites.js';

import '@lion/ui/define/lion-textarea.js';

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
