import { runFormatMixinSuite } from '@lion/ui/form-core-test-suites.js';
import '@lion/ui/define/lion-input-password.js';

const tagString = 'lion-input-password';

describe('<lion-input-password> integrations', () => {
  runFormatMixinSuite({
    tagString,
  });
});
