/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionIcon } from '@lion/ui/icon.js';
import { runIconSuite } from '../test-suites/lion-icon.suite.js';

describe('lion-icon.classes, run with an explicit classes map', () => {
  runIconSuite({ classes: { host: LionIcon } });
});
