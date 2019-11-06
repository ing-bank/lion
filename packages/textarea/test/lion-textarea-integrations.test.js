import { runFormatMixinSuite } from '@lion/field/test-suites/FormatMixin.suite.js';

import '../lion-textarea.js';

const tagString = 'lion-textarea';

describe.only('<lion-textarea> integrations', () => {
  runFormatMixinSuite({
    tagString,
  });
});
