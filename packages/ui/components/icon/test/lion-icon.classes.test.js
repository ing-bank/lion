/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionIcon } from '@lion/ui/icon.js';
import { runIconSuite } from '../test-suites/lion-icon.suite.js';

class MyIcon extends LionIcon {}

describe('lion-icon, run against a subclasser class (classes mode)', () => {
  runIconSuite({ classes: { icon: MyIcon } });
});
