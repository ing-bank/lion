/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionSteps } from '@lion/ui/steps.js';
import { runStepsSuite } from '../test-suites/lion-steps.suite.js';

describe('lion-steps.classes, run with an explicit classes map', () => {
  runStepsSuite({ classes: { host: LionSteps } });
});
