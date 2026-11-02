import {
  runFormGroupMixinSuite,
  runFormGroupMixinInputSuite,
} from '@lion/ui/form-core-test-suites.js';

import { LionFieldset } from '@lion/ui/fieldset.js';
import '@lion/ui/define/lion-fieldset.js';

runFormGroupMixinSuite({ classes: { host: LionFieldset } });
runFormGroupMixinInputSuite({
  classes: { host: LionFieldset },
});
