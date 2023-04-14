import { runChoiceGroupMixinSuite } from '@lion/ui/form-core-test-suites.js';
import '@lion/ui/define/lion-checkbox-group.js';

runChoiceGroupMixinSuite({
  parentTagString: 'lion-checkbox-group',
  childTagString: 'lion-checkbox',
  choiceType: 'multiple',
});
