import { LionStep } from '@lion/ui/steps.js';
import { runStepsSuite } from '@lion/ui/steps-test-suites.js';

class SuiteStep extends LionStep {}

customElements.define('suite-step', SuiteStep);

describe('steps suite with renamed step element', () => {
  runStepsSuite({ classes: { step: SuiteStep } });
});
