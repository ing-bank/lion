/**
 * Proves the subclasser contract for this suite: the caller registers its own element and the
 * suite runs against that tag name (`tagString` mode, see docs/guides/principles/test-suites.md).
 */
import { LionSelect } from '@lion/ui/select.js';

import { runSelectSuite } from '../test-suites/LionSelect.suite.js';

class MySelect extends LionSelect {}

customElements.define('my-select', MySelect);

describe('select test suite, run against a subclasser tag (tagString mode)', () => {
  runSelectSuite({ tagString: 'my-select' });
});
