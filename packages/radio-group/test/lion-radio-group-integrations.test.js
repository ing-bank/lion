import { runChoiceGroupMixinSuite } from '@lion/form-core/test-suites';
import '@lion/radio-group/define';

runChoiceGroupMixinSuite({
  parentTagString: 'lion-radio-group',
  childTagString: 'lion-radio',
  choiceType: 'single',
});
