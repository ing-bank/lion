/**
 * Proves the subclasser contract for this suite: the caller registers its own element and
 * the suite runs against that tag name (`tagString` mode, see
 * docs/guides/principles/test-suites.md).
 */
import { LionInputIban } from '@lion/ui/input-iban.js';

import { runInputIbanSuite } from '../test-suites/lion-input-iban.suite.js';

class MyInputIban extends LionInputIban {}

customElements.define('my-input-iban', MyInputIban);

describe('lion-input-iban suite, run against a subclasser tag (tagString mode)', () => {
  runInputIbanSuite({ tagString: 'my-input-iban' });
});
