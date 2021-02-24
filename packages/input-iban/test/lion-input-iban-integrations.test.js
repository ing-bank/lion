import { runFormatMixinSuite } from '@lion/form-core/test-suites';
import '@lion/input-iban/define';

const tagString = 'lion-input-iban';

describe('<lion-input-iban> integrations', () => {
  runFormatMixinSuite({
    tagString,
    modelValueType: 'iban',
  });
});
