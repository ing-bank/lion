import { runChoiceGroupMixinSuite } from '@lion/form-core/test-suites';
import '@lion/checkbox-group/define';

runChoiceGroupMixinSuite({
  parentTagString: 'lion-checkbox-group',
  childTagString: 'lion-checkbox',
  choiceType: 'multiple',
});
