import { LionCheckbox } from '@lion/ui/checkbox-group.js';
import '@lion/ui/define/lion-checkbox.js';
import { runChoiceInputMixinSuite } from '@lion/ui/test-suites/form-core.js';
runChoiceInputMixinSuite({
  classes: {
    host: LionCheckbox,
  },
});
