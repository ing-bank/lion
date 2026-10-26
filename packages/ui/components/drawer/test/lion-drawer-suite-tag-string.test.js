/**
 * Proves the subclasser contract for this suite: the caller registers its own element and the
 * suite runs against that tag name (`tagString` mode, see docs/guides/principles/test-suites.md).
 */
import { LionDrawer } from '@lion/ui/drawer.js';

import { runDrawerSuite } from '../test-suites/LionDrawer.suite.js';

class MyDrawer extends LionDrawer {}

customElements.define('my-drawer', MyDrawer);

describe('drawer test suite, run against a subclasser tag (tagString mode)', () => {
  runDrawerSuite({ tagString: 'my-drawer' });
});
