/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionInputDate } from '@lion/ui/input-date.js';
import { runInputDateSuite } from '../test-suites/lion-input-date.suite.js';

class MyInputDate extends LionInputDate {}

describe('lion-input-date, run against a subclasser class (classes mode)', () => {
  runInputDateSuite({ classes: { host: MyInputDate } });
});
