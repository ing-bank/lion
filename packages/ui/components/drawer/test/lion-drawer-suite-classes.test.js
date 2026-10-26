/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionDrawer } from '@lion/ui/drawer.js';
import { runDrawerSuite } from '../test-suites/LionDrawer.suite.js';

describe('lion-drawer-suite-classes, run with an explicit classes map', () => {
  runDrawerSuite({ classes: { host: LionDrawer } });
});
