/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionSelectInvoker } from '@lion/ui/select-rich.js';
import { runSelectInvokerSuite } from '../test-suites/lion-select-invoker.suite.js';

describe('lion-select-invoker.classes, run with an explicit classes map', () => {
  runSelectInvokerSuite({ classes: { host: LionSelectInvoker } });
});
