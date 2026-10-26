/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionStep } from '@lion/ui/steps.js';
import { runStepSuite } from '../test-suites/lion-step.suite.js';

describe('lion-step.classes, run with an explicit classes map', () => {
  runStepSuite({ classes: { host: LionStep } });
});
