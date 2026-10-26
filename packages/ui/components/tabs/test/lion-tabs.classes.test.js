/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionTabs } from '@lion/ui/tabs.js';
import { runTabsSuite } from '../test-suites/lion-tabs.suite.js';

describe('lion-tabs.classes, run with an explicit classes map', () => {
  runTabsSuite({ classes: { host: LionTabs } });
});
