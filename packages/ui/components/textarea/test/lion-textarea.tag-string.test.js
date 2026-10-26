/**
 * Proves the subclasser contract for this suite: the caller registers its own element and
 * the suite runs against that tag name (`tagString` mode, see
 * docs/guides/principles/test-suites.md).
 */
import { LionTextarea } from '@lion/ui/textarea.js';

import { runTextareaSuite } from '../test-suites/lion-textarea.suite.js';

class MyTextarea extends LionTextarea {}

customElements.define('my-textarea', MyTextarea);

describe('lion-textarea suite, run against a subclasser tag (tagString mode)', () => {
  runTextareaSuite({ tagString: 'my-textarea' });
});
