import { LionInputEmail } from '@lion/ui/input-email.js';
import '@lion/ui/define/lion-input-email.js';
import { runFormatMixinSuite } from '@lion/ui/test-suites/form-core.js';
describe('<lion-input-email> integrations', () => {
  runFormatMixinSuite({
    classes: {
      host: LionInputEmail,
    },
    modelValueType: 'email',
  });
});
