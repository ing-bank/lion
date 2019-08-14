import { runFormatMixinSuite } from '@lion/field/test-suites/FormatMixin.suite.js';
import '../lion-input-email.js';

const tagString = 'lion-input-email';

describe('<lion-input-email> integrations', () => {
  runFormatMixinSuite({
    tagString,
    modelValueType: 'email',
  });
});
