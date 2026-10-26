/**
 * Proves the subclasser contract for this suite: the caller registers its own element and
 * the suite runs against that tag name (`tagString` mode, see
 * docs/guides/principles/test-suites.md).
 */
import { LionInputEmail } from '@lion/ui/input-email.js';

import { runInputEmailSuite } from '../test-suites/lion-input-email.suite.js';

class MyInputEmail extends LionInputEmail {}

customElements.define('my-input-email', MyInputEmail);

describe('lion-input-email suite, run against a subclasser tag (tagString mode)', () => {
  runInputEmailSuite({ tagString: 'my-input-email' });
});
