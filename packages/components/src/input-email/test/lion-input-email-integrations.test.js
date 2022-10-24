import { runFormatMixinSuite } from '@lion/components/form-core-test-suites.js';
import '@lion/components/define/lion-input-email.js';

const tagString = 'lion-input-email';

describe('<lion-input-email> integrations', () => {
  runFormatMixinSuite({
    tagString,
    modelValueType: 'email',
  });
});
