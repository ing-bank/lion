/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionSelectRich } from '@lion/ui/select-rich.js';
import { runSelectRichSuite } from '../test-suites/lion-select-rich.suite.js';

class MySelectRich extends LionSelectRich {}

describe('lion-select-rich, run against a subclasser class (classes mode)', () => {
  runSelectRichSuite({ classes: { 'select-rich': MySelectRich } });
});
