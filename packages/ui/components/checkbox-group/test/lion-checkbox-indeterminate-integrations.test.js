import '@lion/ui/define/lion-checkbox-indeterminate.js';
import { runChoiceInputMixinSuite } from '@lion/ui/form-core-test-suites.js';
import { runCheckboxIndeterminateSuite } from '../test-suites/CheckboxIndeterminate.suite.js';

runChoiceInputMixinSuite({ tagString: 'lion-checkbox-indeterminate' });
runCheckboxIndeterminateSuite({
  tagString: 'lion-checkbox-indeterminate',
  groupTagString: 'lion-checkbox-group',
  childTagString: 'lion-checkbox',
});
