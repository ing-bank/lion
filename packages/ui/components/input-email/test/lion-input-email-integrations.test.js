import { runFormatMixinSuite } from '@lion/ui/form-core-test-suites.js';
import '@lion/ui/define/lion-input-email.js';

const tagString = 'lion-input-email';

describe('<lion-input-email> integrations', () => {
  runFormatMixinSuite({
    tagString,
    modelValueType: 'email',
  });
});
