/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionSteps } from '@lion/ui/steps.js';
import { runStepsSuite } from '../test-suites/lion-steps.suite.js';

class MySteps extends LionSteps {}

describe('lion-steps, run against a subclasser class (classes mode)', () => {
  runStepsSuite({ classes: { steps: MySteps } });
});
