/**
 * Proves the subclasser contract for this suite: the caller registers its own element and
 * the suite runs against that tag name (`tagString` mode, see
 * docs/guides/principles/test-suites.md).
 */
import { LionStep } from '@lion/ui/steps.js';

import { runStepSuite } from '../test-suites/lion-step.suite.js';

class MyStep extends LionStep {}

customElements.define('my-step', MyStep);

describe('lion-step suite, run against a subclasser tag (tagString mode)', () => {
  runStepSuite({ tagString: 'my-step' });
});
