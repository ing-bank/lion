/**
 * Proves the subclasser contract for this suite: the caller registers its own element and
 * the suite runs against that tag name (`tagString` mode, see
 * docs/guides/principles/test-suites.md).
 */
import { LionInputDate } from '@lion/ui/input-date.js';

import { runInputDateSuite } from '../test-suites/lion-input-date.suite.js';

class MyInputDate extends LionInputDate {}

customElements.define('my-input-date', MyInputDate);

describe('lion-input-date suite, run against a subclasser tag (tagString mode)', () => {
  runInputDateSuite({ tagString: 'my-input-date' });
});
