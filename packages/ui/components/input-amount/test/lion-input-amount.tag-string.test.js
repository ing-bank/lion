/**
 * Proves the subclasser contract for this suite: the caller registers its own element and
 * the suite runs against that tag name (`tagString` mode, see
 * docs/guides/principles/test-suites.md).
 */
import { LionInputAmount } from '@lion/ui/input-amount.js';

import { runInputAmountSuite } from '../test-suites/lion-input-amount.suite.js';

class MyInputAmount extends LionInputAmount {}

customElements.define('my-ui-input-amount', MyInputAmount);

describe('lion-input-amount suite, run against a subclasser tag (tagString mode)', () => {
  runInputAmountSuite({ tagString: 'my-ui-input-amount' });
});
