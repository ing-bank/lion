import { runFormGroupMixinSuite, runFormGroupMixinInputSuite } from '@lion/form-core/test-suites';

import '@lion/fieldset/define';

runFormGroupMixinSuite({ tagString: 'lion-fieldset' });
runFormGroupMixinInputSuite({ tagString: 'lion-fieldset' });
