/**
 * Proves the subclasser contract for this suite: the caller registers its own element and
 * the suite runs against that tag name (`tagString` mode, see
 * docs/guides/principles/test-suites.md).
 */
import { LionInputRange } from '@lion/ui/input-range.js';

import { runInputRangeSuite } from '../test-suites/lion-input-range.suite.js';

class MyInputRange extends LionInputRange {}

customElements.define('my-ui-input-range', MyInputRange);

describe('lion-input-range suite, run against a subclasser tag (tagString mode)', () => {
  runInputRangeSuite({ tagString: 'my-ui-input-range' });
});
