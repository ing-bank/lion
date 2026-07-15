import '@lion/ui/define/lion-radio-with-user-value.js';
import {
  runChoiceInputMixinSuite,
  runCustomChoiceInputMixinSuite,
} from '@lion/ui/form-core-test-suites.js';

runChoiceInputMixinSuite({ tagString: 'lion-radio-with-user-value' });
runCustomChoiceInputMixinSuite({ tagString: 'lion-radio-with-user-value' });
