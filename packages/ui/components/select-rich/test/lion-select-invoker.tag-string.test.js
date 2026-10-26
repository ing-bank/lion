/**
 * Proves the subclasser contract for this suite: the caller registers its own element and the
 * suite runs against that tag name (`tagString` mode, see
 * docs/guides/principles/test-suites.md).
 */
import { LionSelectInvoker } from '@lion/ui/select-rich.js';

import { runSelectInvokerSuite } from '../test-suites/lion-select-invoker.suite.js';

class MySelectInvoker extends LionSelectInvoker {}

customElements.define('my-ui-select-invoker', MySelectInvoker);

describe('lion-select-invoker suite, run against a subclasser tag (tagString mode)', () => {
  runSelectInvokerSuite({ tagString: 'my-ui-select-invoker' });
});
