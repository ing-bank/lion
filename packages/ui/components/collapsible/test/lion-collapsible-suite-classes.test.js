/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionCollapsible } from '@lion/ui/collapsible.js';
import { runCollapsibleSuite } from '../test-suites/LionCollapsible.suite.js';

class MyCollapsible extends LionCollapsible {}

describe('lion-collapsible-suite-tag-string.test.js, run against a subclasser class (classes mode)', () => {
  runCollapsibleSuite({ classes: { host: MyCollapsible } });
});
