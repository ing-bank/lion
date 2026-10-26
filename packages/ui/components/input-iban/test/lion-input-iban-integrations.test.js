import { LionInputIban } from '@lion/ui/input-iban.js';
import '@lion/ui/define/lion-input-iban.js';
import { runFormatMixinSuite } from '@lion/ui/form-core-test-suites.js';

describe('<lion-input-iban> integrations', () => {
  runFormatMixinSuite({
    classes: { host: LionInputIban },
    modelValueType: 'iban',
  });
});
