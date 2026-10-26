/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionProgressIndicator } from '@lion/ui/progress-indicator.js';
import { runProgressIndicatorSuite } from '../test-suites/lion-progress-indicator.suite.js';

describe('lion-progress-indicator.classes, run with an explicit classes map', () => {
  runProgressIndicatorSuite({ classes: { host: LionProgressIndicator } });
});
