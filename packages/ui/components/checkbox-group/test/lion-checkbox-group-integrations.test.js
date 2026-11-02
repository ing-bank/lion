import { LionCheckbox, LionCheckboxGroup } from '@lion/ui/checkbox-group.js';
import { runChoiceGroupMixinSuite } from '@lion/ui/form-core-test-suites.js';
import '@lion/ui/define/lion-checkbox-group.js';

runChoiceGroupMixinSuite({
  classes: { host: LionCheckboxGroup, child: LionCheckbox },
  choiceType: 'multiple',
});
