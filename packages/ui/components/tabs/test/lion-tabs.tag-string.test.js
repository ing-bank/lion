/**
 * Proves the subclasser contract for this suite: the caller registers its own element and
 * the suite runs against that tag name (`tagString` mode, see
 * docs/guides/principles/test-suites.md).
 */
import { LionTabs } from '@lion/ui/tabs.js';

import { runTabsSuite } from '../test-suites/lion-tabs.suite.js';

class MyTabs extends LionTabs {}

customElements.define('my-tabs', MyTabs);

describe('lion-tabs suite, run against a subclasser tag (tagString mode)', () => {
  runTabsSuite({ tagString: 'my-tabs' });
});
