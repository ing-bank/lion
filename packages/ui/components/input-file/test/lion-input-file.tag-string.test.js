/**
 * Proves the subclasser contract for this suite: the caller registers its own element and
 * the suite runs against that tag name (`tagString` mode, see
 * docs/guides/principles/test-suites.md).
 */
import { LionInputFile } from '@lion/ui/input-file.js';

import { runInputFileSuite } from '../test-suites/lion-input-file.suite.js';

class MyInputFile extends LionInputFile {}

customElements.define('my-ui-input-file', MyInputFile);

describe('lion-input-file suite, run against a subclasser tag (tagString mode)', () => {
  runInputFileSuite({ tagString: 'my-ui-input-file' });
});
