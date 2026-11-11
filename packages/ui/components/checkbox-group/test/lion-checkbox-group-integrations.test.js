import { LionCheckbox, LionCheckboxGroup } from '@lion/ui/checkbox-group.js';
import { runChoiceGroupMixinSuite } from '@lion/ui/test-suites/form-core.js';
import '@lion/ui/define/lion-checkbox-group.js';
runChoiceGroupMixinSuite({
  classes: {
    host: LionCheckboxGroup,
    child: LionCheckbox,
  },
  choiceType: 'multiple',
});
