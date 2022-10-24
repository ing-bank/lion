import { runFormatMixinSuite } from '@lion/ui/form-core-test-suites.js';
import '@lion/ui/define/lion-input-iban.js';

const tagString = 'lion-input-iban';

describe('<lion-input-iban> integrations', () => {
  runFormatMixinSuite({
    tagString,
    modelValueType: 'iban',
  });
});
