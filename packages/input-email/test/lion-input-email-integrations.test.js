import { runFormatMixinSuite } from '@lion/form-core/test-suites';
import '@lion/input-email/define';

const tagString = 'lion-input-email';

describe('<lion-input-email> integrations', () => {
  runFormatMixinSuite({
    tagString,
    modelValueType: 'email',
  });
});
