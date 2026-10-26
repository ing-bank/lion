/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionDrawer } from '@lion/ui/drawer.js';
import { runDrawerSuite } from '../test-suites/LionDrawer.suite.js';

class MyDrawer extends LionDrawer {}

describe('lion-drawer-suite-tag-string.test.js, run against a subclasser class (classes mode)', () => {
  runDrawerSuite({ classes: { drawer: MyDrawer } });
});
