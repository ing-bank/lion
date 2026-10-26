/**
 * Proves the subclasser contract for this suite: the caller registers its own element and
 * the suite runs against that tag name (`tagString` mode, see
 * docs/guides/principles/test-suites.md).
 */
import { LionProgressIndicator } from '@lion/ui/progress-indicator.js';

import { runProgressIndicatorSuite } from '../test-suites/lion-progress-indicator.suite.js';

class MyProgressIndicator extends LionProgressIndicator {}

customElements.define('my-ui-progress-indicator', MyProgressIndicator);

describe('lion-progress-indicator suite, run against a subclasser tag (tagString mode)', () => {
  runProgressIndicatorSuite({ tagString: 'my-ui-progress-indicator' });
});
