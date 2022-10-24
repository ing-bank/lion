import { runFormatMixinSuite } from '@lion/components/form-core-test-suites.js';
import '@lion/components/define/lion-input-iban.js';

const tagString = 'lion-input-iban';

describe('<lion-input-iban> integrations', () => {
  runFormatMixinSuite({
    tagString,
    modelValueType: 'iban',
  });
});
