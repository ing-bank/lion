import { runFormatMixinSuite } from '@lion/field/test-suites/FormatMixin.suite.js';
import '../lion-input-iban.js';

const tagString = 'lion-input-iban';

describe('<lion-input-iban> integrations', () => {
  runFormatMixinSuite({
    tagString,
    modelValueType: 'iban',
  });
});
