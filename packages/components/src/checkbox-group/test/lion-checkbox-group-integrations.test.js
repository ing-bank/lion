import { runChoiceGroupMixinSuite } from '@lion/components/form-core-test-suites.js';
import '@lion/components/define/lion-checkbox-group.js';

runChoiceGroupMixinSuite({
  parentTagString: 'lion-checkbox-group',
  childTagString: 'lion-checkbox',
  choiceType: 'multiple',
});
