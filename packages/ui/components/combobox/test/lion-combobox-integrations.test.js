import { runListboxMixinSuite } from '@lion/ui/listbox-test-suites.js';
import { runCustomChoiceGroupMixinSuite } from '@lion/ui/form-core-test-suites.js';
import '@lion/ui/define/lion-combobox.js';

runListboxMixinSuite({ tagString: 'lion-combobox' });
runCustomChoiceGroupMixinSuite({
  parentTagString: 'lion-combobox',
  childTagString: 'lion-option',
});
