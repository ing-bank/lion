/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionProgressIndicator } from '@lion/ui/progress-indicator.js';
import { runProgressIndicatorSuite } from '../test-suites/lion-progress-indicator.suite.js';

class MyProgressIndicator extends LionProgressIndicator {}

describe('lion-progress-indicator, run against a subclasser class (classes mode)', () => {
  runProgressIndicatorSuite({ classes: { host: MyProgressIndicator } });
});
