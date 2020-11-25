import { runChoiceGroupMixinSuite } from '@lion/form-core/test-suites/choice-group/ChoiceGroupMixin.suite.js';
import '../lion-checkbox-group.js';
import '../lion-checkbox.js';

runChoiceGroupMixinSuite({
  parentTagString: 'lion-checkbox-group',
  childTagString: 'lion-checkbox',
  choiceType: 'multiple',
});
