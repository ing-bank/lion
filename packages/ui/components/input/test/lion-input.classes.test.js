/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionInput } from '@lion/ui/input.js';
import { runInputSuite } from '../test-suites/lion-input.suite.js';

describe('lion-input.classes, run with an explicit classes map', () => {
  runInputSuite({ classes: { host: LionInput } });
});
