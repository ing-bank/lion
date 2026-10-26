/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionInputFile } from '@lion/ui/input-file.js';
import { runInputFileSuite } from '../test-suites/lion-input-file.suite.js';

describe('lion-input-file.classes, run with an explicit classes map', () => {
  runInputFileSuite({ classes: { host: LionInputFile } });
});
