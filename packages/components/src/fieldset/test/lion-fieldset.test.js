import {
  runFormGroupMixinSuite,
  runFormGroupMixinInputSuite,
} from '@lion/components/form-core-test-suites.js';

import '@lion/components/define/lion-fieldset.js';

runFormGroupMixinSuite({ tagString: 'lion-fieldset' });
runFormGroupMixinInputSuite({ tagString: 'lion-fieldset' });
