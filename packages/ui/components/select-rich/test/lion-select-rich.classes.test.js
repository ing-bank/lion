/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionSelectRich } from '@lion/ui/select-rich.js';
import { runSelectRichSuite } from '../test-suites/lion-select-rich.suite.js';

describe('lion-select-rich.classes, run with an explicit classes map', () => {
  runSelectRichSuite({ classes: { host: LionSelectRich } });
});
