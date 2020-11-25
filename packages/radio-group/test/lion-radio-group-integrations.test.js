import { runChoiceGroupMixinSuite } from '@lion/form-core/test-suites/choice-group/ChoiceGroupMixin.suite.js';
import '../lion-radio-group.js';
import '../lion-radio.js';

runChoiceGroupMixinSuite({
  parentTagString: 'lion-radio-group',
  childTagString: 'lion-radio',
  choiceType: 'single',
});
