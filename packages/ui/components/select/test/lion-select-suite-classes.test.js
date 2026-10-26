/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionSelect } from '@lion/ui/select.js';
import { runSelectSuite } from '../test-suites/LionSelect.suite.js';

class MySelect extends LionSelect {}

describe('lion-select-suite-tag-string.test.js, run against a subclasser class (classes mode)', () => {
  runSelectSuite({ classes: { select: MySelect } });
});
