/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionTabs } from '@lion/ui/tabs.js';
import { runTabsSuite } from '../test-suites/lion-tabs.suite.js';

class MyTabs extends LionTabs {}

describe('lion-tabs, run against a subclasser class (classes mode)', () => {
  runTabsSuite({ classes: { host: MyTabs } });
});
