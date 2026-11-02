import { LionCheckbox } from '@lion/ui/checkbox-group.js';
import '@lion/ui/define/lion-checkbox.js';
import { runChoiceInputMixinSuite } from '@lion/ui/form-core-test-suites.js';

runChoiceInputMixinSuite({ classes: { host: LionCheckbox } });
