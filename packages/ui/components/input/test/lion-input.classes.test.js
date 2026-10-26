/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionInput } from '@lion/ui/input.js';
import { runInputSuite } from '../test-suites/lion-input.suite.js';

class MyInput extends LionInput {}

describe('lion-input, run against a subclasser class (classes mode)', () => {
  runInputSuite({ classes: { host: MyInput } });
});
