import { runFormGroupMixinSuite } from '@lion/form-core/test-suites/form-group/FormGroupMixin.suite.js';
import { runFormGroupMixinInputSuite } from '@lion/form-core/test-suites/form-group/FormGroupMixin-input.suite.js';
import '../lion-fieldset.js';

runFormGroupMixinSuite({ tagString: 'lion-fieldset' });
runFormGroupMixinInputSuite({ tagString: 'lion-fieldset' });
