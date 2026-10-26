import { LionInputEmail } from '@lion/ui/input-email.js';
import '@lion/ui/define/lion-input-email.js';
import { runFormatMixinSuite } from '@lion/ui/form-core-test-suites.js';

describe('<lion-input-email> integrations', () => {
  runFormatMixinSuite({
    classes: { host: LionInputEmail },
    modelValueType: 'email',
  });
});
