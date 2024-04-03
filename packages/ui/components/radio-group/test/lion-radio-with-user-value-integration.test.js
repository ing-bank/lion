import '@lion/ui/define/lion-radio-with-user-value.js';
import {
  runChoiceInputMixinSuite,
  runChoiceUserInputMixinSuite,
} from '@lion/ui/form-core-test-suites.js';

runChoiceInputMixinSuite({ tagString: 'lion-radio-with-user-value' });
runChoiceUserInputMixinSuite({ tagString: 'lion-radio-with-user-value' });
