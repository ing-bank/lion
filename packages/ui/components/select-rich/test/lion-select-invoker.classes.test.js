/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionSelectInvoker } from '@lion/ui/select-rich.js';
import { runSelectInvokerSuite } from '../test-suites/lion-select-invoker.suite.js';

class MySelectInvoker extends LionSelectInvoker {}

describe('lion-select-invoker, run against a subclasser class (classes mode)', () => {
  runSelectInvokerSuite({ classes: { 'select-invoker': MySelectInvoker } });
});
