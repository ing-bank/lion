/**
 * Proves the subclasser contract for this suite: the caller registers its own element and
 * the suite runs against that tag name (`tagString` mode, see
 * docs/guides/principles/test-suites.md).
 */
import { LionTooltip } from '@lion/ui/tooltip.js';

import { runTooltipSuite } from '../test-suites/lion-tooltip.suite.js';

class MyTooltip extends LionTooltip {}

customElements.define('my-tooltip', MyTooltip);

describe('lion-tooltip suite, run against a subclasser tag (tagString mode)', () => {
  runTooltipSuite({ tagString: 'my-tooltip' });
});
