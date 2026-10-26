/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionStep } from '@lion/ui/steps.js';
import { runStepSuite } from '../test-suites/lion-step.suite.js';

class MyStep extends LionStep {}

describe('lion-step, run against a subclasser class (classes mode)', () => {
  runStepSuite({ classes: { host: MyStep } });
});
