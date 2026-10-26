/**
 * Proves the subclasser contract for this suite: the caller registers its own element and
 * the suite runs against that tag name (`tagString` mode, see
 * docs/guides/principles/test-suites.md).
 */
import { LionIcon } from '@lion/ui/icon.js';

import { runIconSuite } from '../test-suites/lion-icon.suite.js';

class MyIcon extends LionIcon {}

customElements.define('my-ui-icon', MyIcon);

describe('lion-icon suite, run against a subclasser tag (tagString mode)', () => {
  runIconSuite({ tagString: 'my-ui-icon' });
});
