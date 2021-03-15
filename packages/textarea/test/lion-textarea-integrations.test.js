import { runFormatMixinSuite } from '@lion/form-core/test-suites';

import '@lion/textarea/define';

const tagString = 'lion-textarea';

describe('<lion-textarea> integrations', () => {
  runFormatMixinSuite({
    tagString,
  });
});
