/**
 * Proves the subclasser contract for this suite: the caller registers its own element and
 * the suite runs against that tag name (`tagString` mode, see
 * docs/guides/principles/test-suites.md).
 */
import { LionSwitch } from '@lion/ui/switch.js';

import { runSwitchSuite } from '../test-suites/lion-switch.suite.js';

class MySwitch extends LionSwitch {}

customElements.define('my-ui-switch', MySwitch);

describe('lion-switch suite, run against a subclasser tag (tagString mode)', () => {
  runSwitchSuite({ tagString: 'my-ui-switch' });
});
