/**
 * Proves the subclasser contract for this suite: the caller registers its own element and the
 * suite runs against that tag name (`tagString` mode, see docs/guides/principles/test-suites.md).
 */
import { LionCollapsible } from '@lion/ui/collapsible.js';

import { runCollapsibleSuite } from '../test-suites/LionCollapsible.suite.js';

class MyCollapsible extends LionCollapsible {}

customElements.define('my-collapsible', MyCollapsible);

describe('collapsible test suite, run against a subclasser tag (tagString mode)', () => {
  runCollapsibleSuite({ tagString: 'my-collapsible' });
});
