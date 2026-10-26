/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionSelect } from '@lion/ui/select.js';
import { runSelectSuite } from '../test-suites/LionSelect.suite.js';

describe('lion-select-suite-classes, run with an explicit classes map', () => {
  runSelectSuite({ classes: { host: LionSelect } });
});
