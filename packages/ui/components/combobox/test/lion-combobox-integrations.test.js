import { runListboxMixinSuite } from '@lion/ui/listbox-test-suites.js';
import '@lion/ui/define/lion-combobox.js';
import { runCustomChoiceGroupMixinSuite } from '../../form-core/test-suites/choice-group/CustomChoiceGroupMixin.suite.js';

runListboxMixinSuite({ tagString: 'lion-combobox' });
runCustomChoiceGroupMixinSuite({
  parentTagString: 'lion-combobox',
  childTagString: 'lion-option',
});
