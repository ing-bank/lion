/**
 * Proves the subclasser contract for this suite: the caller registers its own element and
 * the suite runs against that tag name (`tagString` mode, see
 * docs/guides/principles/test-suites.md).
 */
import { LionSwitchButton } from '@lion/ui/switch.js';

import { runSwitchButtonSuite } from '../test-suites/lion-switch-button.suite.js';

class MySwitchButton extends LionSwitchButton {}

customElements.define('my-ui-switch-button', MySwitchButton);

describe('lion-switch-button suite, run against a subclasser tag (tagString mode)', () => {
  runSwitchButtonSuite({ tagString: 'my-ui-switch-button' });
});
