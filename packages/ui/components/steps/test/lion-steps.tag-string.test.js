/**
 * Proves the subclasser contract for this suite (`tagString` mode).
 */
import { LionSteps } from '@lion/ui/steps.js';

import { runStepsSuite } from '../test-suites/lion-steps.suite.js';

class MySteps extends LionSteps {}

customElements.define('my-ui-steps', MySteps);

describe('lion-steps suite, run against a subclasser tag (tagString mode)', () => {
  runStepsSuite({ tagString: 'my-ui-steps' });
});
