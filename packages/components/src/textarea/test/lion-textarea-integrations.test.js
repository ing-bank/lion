import {
  runInteractionStateMixinSuite,
  runFormatMixinSuite,
  runNativeTextFieldMixinSuite,
} from '@lion/components/form-core-test-suites.js';

import '@lion/components/define/lion-textarea.js';

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
