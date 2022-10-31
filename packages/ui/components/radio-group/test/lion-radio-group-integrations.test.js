import { runChoiceGroupMixinSuite } from '@lion/ui/form-core-test-suites.js';
import '@lion/ui/define/lion-radio-group.js';
import '@lion/ui/define/lion-radio.js';

runChoiceGroupMixinSuite({
  parentTagString: 'lion-radio-group',
  childTagString: 'lion-radio',
  choiceType: 'single',
});
