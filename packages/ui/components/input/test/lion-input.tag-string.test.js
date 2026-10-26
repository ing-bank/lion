/**
 * Proves the subclasser contract for this suite: the caller registers its own element and
 * the suite runs against that tag name (`tagString` mode, see
 * docs/guides/principles/test-suites.md).
 */
import { LionInput } from '@lion/ui/input.js';

import { runInputSuite } from '../test-suites/lion-input.suite.js';

class MyInput extends LionInput {}

customElements.define('my-input', MyInput);

describe('lion-input suite, run against a subclasser tag (tagString mode)', () => {
  runInputSuite({ tagString: 'my-input' });
});
