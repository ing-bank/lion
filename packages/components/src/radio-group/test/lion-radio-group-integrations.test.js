import { runChoiceGroupMixinSuite } from '@lion/components/form-core-test-suites.js';
import '@lion/components/define/lion-radio-group.js';
import '@lion/components/define/lion-radio.js';

runChoiceGroupMixinSuite({
  parentTagString: 'lion-radio-group',
  childTagString: 'lion-radio',
  choiceType: 'single',
});
