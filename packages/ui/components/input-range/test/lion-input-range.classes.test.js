/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionInputRange } from '@lion/ui/input-range.js';
import { runInputRangeSuite } from '../test-suites/lion-input-range.suite.js';

describe('lion-input-range.classes, run with an explicit classes map', () => {
  runInputRangeSuite({ classes: { host: LionInputRange } });
});
