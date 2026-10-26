/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionInputDate } from '@lion/ui/input-date.js';
import { runInputDateSuite } from '../test-suites/lion-input-date.suite.js';

describe('lion-input-date.classes, run with an explicit classes map', () => {
  runInputDateSuite({ classes: { host: LionInputDate } });
});
