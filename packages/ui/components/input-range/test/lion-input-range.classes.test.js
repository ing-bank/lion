/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionInputRange } from '@lion/ui/input-range.js';
import { runInputRangeSuite } from '../test-suites/lion-input-range.suite.js';

class MyInputRange extends LionInputRange {}

describe('lion-input-range, run against a subclasser class (classes mode)', () => {
  runInputRangeSuite({ classes: { host: MyInputRange } });
});
