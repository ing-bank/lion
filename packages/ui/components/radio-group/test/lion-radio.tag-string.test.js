/**
 * Proves the subclasser contract for this suite: the caller registers its own element(s) and the
 * suite runs against those tag names (`tagString` mode, see
 * docs/guides/principles/test-suites.md).
 */
import { LionRadio } from '@lion/ui/radio-group.js';

import { runRadioSuite } from '../test-suites/lion-radio.suite.js';

class MyRadio extends LionRadio {}

customElements.define('my-ui-radio', MyRadio);

describe('lion-radio suite, run against a subclasser tag (tagString mode)', () => {
  runRadioSuite({ tagString: 'my-ui-radio' });
});
