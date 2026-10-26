/**
 * Proves the subclasser contract for this suite: the caller registers its own element and the
 * suite runs against that tag name (`tagString` mode, see
 * docs/guides/principles/test-suites.md).
 */
import { LionSelectRich } from '@lion/ui/select-rich.js';

import { runSelectRichSuite } from '../test-suites/lion-select-rich.suite.js';

class MySelectRich extends LionSelectRich {}

customElements.define('my-ui-select-rich', MySelectRich);

describe('lion-select-rich suite, run against a subclasser tag (tagString mode)', () => {
  runSelectRichSuite({ tagString: 'my-ui-select-rich' });
});
