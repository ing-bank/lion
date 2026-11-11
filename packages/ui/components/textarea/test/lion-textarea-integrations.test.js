import {
  runFormatMixinSuite,
  runInteractionStateMixinSuite,
  runNativeTextFieldMixinSuite,
} from '@lion/ui/test-suites/form-core.js';

import '@lion/ui/define/lion-textarea.js';

const tagString = 'lion-textarea';

describe('<lion-textarea> integrations', () => {
  runInteractionStateMixinSuite({
    tagString,
  });

  runFormatMixinSuite({
    tagString,
    modelValueType: String,
  });

  runNativeTextFieldMixinSuite({
    tagString,
  });
});
